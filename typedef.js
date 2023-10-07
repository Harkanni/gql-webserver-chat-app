const messages = [];

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
      postCreated: Post
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
      return messages[id];
    }
  }
};
