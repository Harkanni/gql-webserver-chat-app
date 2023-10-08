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
      pubsub.publish('NEW_MESSAGE_CREATED', { messages: messages  });
      return messages[id];
    }
  },
  Subscription: {
   messages: {
      subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE_CREATED']),
      resolve: async () => {
         // Fetch and return initial data
         const initialData = messages;
         return initialData;
       },
   }
  }
};
