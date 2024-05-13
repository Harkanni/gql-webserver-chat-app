// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';
// import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { createClient } from 'graphql-ws';
// import { getMainDefinition } from '@apollo/client/utilities';

// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   split, HttpLink,
//   useQuery,
//   gql
// } from '@apollo/client';

// const HTTP_PROD_URL = "https://crabby-teal-slippers.cyclic.app/graphql"
// const WS_PROD_URL = "https://crabby-teal-slippers.cyclic.app/graphql"
// const WS_DEV_URL = "ws://localhost:4000/graphql"
// const HTTP_DEV_URL = "http://localhost:4000/graphql"

// if (process.env.NODE_ENV !== 'production') {
//   // Adds messages only in a dev environment

//   loadDevMessages();

//   loadErrorMessages();
// }

// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: process.env.NODE_ENV === 'production' ? WS_PROD_URL : WS_DEV_URL       // 'ws://localhost:4000/graphql'
//   })
// );

// const httpLink = new HttpLink({
//   uri: process.env.NODE_ENV === 'production' ? HTTP_PROD_URL : HTTP_DEV_URL      // 'http://localhost:4000/graphql'
// });

// const splitLink = split(
//    ({ query }) => { 
//      const definition = getMainDefinition(query); 
//      return ( 
//        definition.kind === 'OperationDefinition' && 
//        definition.operation === 'subscription' 
//      ); 
//    }, 
//    wsLink, 
//    httpLink, 
//  );


// const client = new ApolloClient({
//    link: splitLink,
//    cache: new InMemoryCache()
// });



// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>
//   </React.StrictMode>
// );
