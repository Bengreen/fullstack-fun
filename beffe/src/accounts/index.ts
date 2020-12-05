import {ApolloServer, gql} from 'apollo-server';
import {buildFederatedSchema} from '@apollo/federation';
import fetch from 'node-fetch';

import {accounts} from './data';

const port = 4001;

const typeDefs = gql`
  """
  This is the account info for the users
  """
  type Account @key(fields: "id") {
    id: ID!
    name: String
    email: String
    password: String
  }

  type Verbose {
    verboseView: Boolean
    extra: String
  }

  type Child {
    uuid: String!
  }

  type Parent {
    uuid: String!
    children: [Child]
  }


  extend type Query {
    """
    Query an account by id
    """
    account(id: ID!): Account
    accounts: [Account]
    snow: String
    james: String
    hannah: String
    verbose: Verbose
    verbose2: Verbose
    protected: String
    open: String
  }
`;
const apiTestURL = 'https://localdev-app.gcp.mle-dev.digitalreasoning.com/api_test/v0';
const resolvers = {
  Account: {
    _resolveReference(object: { id: string; }) {
      return accounts.find((account) => account.id === object.id);
    },
  },
  Query: {
    account(parent: any, {id}: any) {
      return accounts.find((account) => account.id === id);
    },
    accounts() {
      return accounts;
    },
    snow: () => `Hello`,
    james: () => 'I am James',
    hannah: () => 'I am Hannah',
    verbose: () => ({verboseView: true, extra: 'verbose'}),
    verbose2: () => fetch(`${apiTestURL}/verbose`).then((res) => res.json()),
    protected: () => 'protected',
    open: () => 'open',
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{typeDefs, resolvers}]),
});

server.listen({port}).then(({url}) => {
  console.log(`Accounts service ready at ${url}`);
});
