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

const HTTP_PROD_URL = "https://crabby-teal-slippers.cyclic.app/graphql"
const WS_PROD_URL = "ws://crabby-teal-slippers.cyclic.app/graphql"
const WS_DEV_URL = "ws://localhost:4000/graphql"
const HTTP_DEV_URL = "http://localhost:4000/graphql"

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment

  loadDevMessages();

  loadErrorMessages();
}

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.NODE_ENV !== 'production' ? WS_DEV_URL : WS_PROD_URL      // 'ws://localhost:4000/graphql'
  })
);


const client = new ApolloClient({
   link: wsLink,
   cache: new InMemoryCache()
});



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
