import {gql} from 'apollo-server';

export const typeDefs = gql`
  type Book {
    title: String
    author: String
    age: Int
  }
  type Query {
    books: [Book]
  }
`;
