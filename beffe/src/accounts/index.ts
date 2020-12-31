/* eslint-disable max-len */
import express from 'express';
import yargs, { command } from 'yargs';
import figlet from 'figlet';
import yaml from 'js-yaml';
import fs from 'fs';
import {
  GraphQLResolverMap,
} from 'apollo-graphql';
import {
  ApolloServer,
  gql,
} from 'apollo-server-express';
import {
  DocumentNode,
} from 'graphql';
import {
  buildFederatedSchema,
} from '@apollo/federation';
import {
  makeExecutableSchema,
} from 'graphql-tools';
import fetch from 'node-fetch';

import { accounts } from './data';


function builder(yargs: yargs.Argv<{}>) {
  // console.log('gatewayCLI called with ',yargs);
  return yargs
    .env('ACCOUNTS')
    .option('port', {
      alias: 'p',
      default: 4001,
      describe: 'Port for gateway'
    })
    .option('path', {
      default: '/graphql',
      describe: 'Path to serve GraphQL'
    })
    .option('federated', {
      describe: 'Enable federation',
      type: 'boolean',
      default: false
    })
    .help();
}

function handler(argv: any) {
  console.log(figlet.textSync('Accounts 1.0', 'Rectangles'));

  startAccounts(Number(argv.port), String(argv.path), typeDefs, resolvers, Boolean(argv.federated));
}

function startAccounts(
  port: number,
  path: string,
  typeDefs: DocumentNode,
  resolvers: GraphQLResolverMap<any>,
  federated: boolean,
  verbose = false
) {
  if (verbose) console.info(`start server on :${port}`);
  if (federated) console.info('Creating Federated GraphQL');


  const mySchema = federated ? buildFederatedSchema([{ typeDefs, resolvers }]) : makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema: mySchema });

  const app = express();

  app.get('/alive', (req, res) => {
    console.log("alive")
    res.json({ hello: 'I am alive!' });
  });

  app.get('/ready', (req, res) => {
    console.log("ready")
    res.json({ hello: 'I am ready!' });
  });

  server.applyMiddleware({ app, path: path });

  app.listen({ port: port }, () =>
    console.log(
      `Gateway Stitch server: http://localhost:${port}${server.graphqlPath}`,
    ),
  );

}

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
const apiTestURL = 'https://simple.k8s/api_test/v0';
const resolvers = {
  Account: {
    _resolveReference(object: { id: string; }) {
      return accounts.find((account) => account.id === object.id);
    },
  },
  Query: {
    account(parent: any, { id }: any) {
      return accounts.find((account) => account.id === id);
    },
    accounts() {
      return accounts;
    },
    snow: () => `Hello`,
    james: () => 'I am James',
    hannah: () => 'I am Hannah',
    verbose: () => ({ verboseView: true, extra: 'verbose' }),
    verbose2: () => fetch(`${apiTestURL}/verbose`).then((res) => res.json()),
    protected: () => 'protected',
    open: () => 'open',
  },
};


export const cliCommand = {
  command: 'accounts [port]',
  aliases: '',
  describe: 'Create and expose a accounts as GraphQL',
  builder: builder,
  handler: handler,
  deprecated: false
}


if (require.main === module) {
  cliCommand.handler(cliCommand.builder(yargs).argv);
}
