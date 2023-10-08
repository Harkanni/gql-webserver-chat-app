import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split, HttpLink,
  useQuery,
  gql
} from '@apollo/client';

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment

  loadDevMessages();

  loadErrorMessages();
}

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql'
  })
);

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const splitLink = split(
   ({ query }) => { 
     const definition = getMainDefinition(query); 
     return ( 
       definition.kind === 'OperationDefinition' && 
       definition.operation === 'subscription' 
     ); 
   }, 
   wsLink, 
   httpLink, 
 );


const client = new ApolloClient({
   link: splitLink,
   cache: new InMemoryCache()
});



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
