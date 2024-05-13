import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from './typedef.js';

import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer  } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'


const app = express();
const httpServer = http.createServer(app)

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
   schema,
   plugins: [
      // PROPER SHUTDOWN FOR THE HTTP SERVER
      ApolloServerPluginDrainHttpServer({ httpServer }),
      
      // PROPER SHUTDOWN FOR THE WEBSOCKET SERVER
      {
         async serverWillStart() {
            return {
               async drainServer() {
                  await serverCleanup.dispose();
               }
            }
         }
      }
   ],      
 });

 const wsServer = new WebSocketServer({
   server: httpServer,
   path: '/graphql',
   // path: '/subscriptions',
 })

 const serverCleanup = useServer({ schema }, wsServer);


 await server.start();

 app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server, {
   context: async ({ req }) => ({ token: req.headers.token }),
 }));

 await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
