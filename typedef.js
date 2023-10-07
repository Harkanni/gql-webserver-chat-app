// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
// import express from 'express';
// import http from 'http';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { json } from 'body-parser';

// import { makeExecutableSchema } from '@graphql-tools/schema'
// import { WebSocketServer  } from 'ws'
// import { useServer } from 'graphql-ws/lib/use/ws'


// const app = express();

// const httpServer = http.createServer(app)

// const server = new ApolloServer({
//    typeDefs, 
//    resolvers, 
//    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//  });

//  await server.start();

//  app.use('/graphql', cors(), json(), expressMiddleware(server, {
//    context: async ({ req }) => ({ token: req.headers.token }),
//  }));

//  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

// console.log(`🚀 Server ready at http://localhost:4000/`);





import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

const messages = [];
const subscribers = [];
const onMessagesUpdate = (fn) => subscribers.push(fn); //

export const typeDefs = `#graphql
   type Message {
      id: ID!
      user: String!
      content: String!  
   }

   type Query {
      messages: [Message!]
   }

   type Mutation {
      addMessage(user: String!, content: String!): Message
   }

   type Subscription {
      messages: [Message!]
   }
`;

export const resolvers = {
  Query: {
    messages() {
      return messages;
    }
  },

  Mutation: {
    addMessage(parent, args) {
      const id = messages.length;
      messages.push({
        id,
        ...args
      });
      pubsub.publish('NEW_MESSAGE_CREATED', { messages: messages });
      return messages[id];
    }
  },
  Subscription: {
   messages: {
      subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE_CREATED'])
   }
  }
};
