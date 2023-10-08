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