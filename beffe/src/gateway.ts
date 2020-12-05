/* eslint-disable max-len */
import {ApolloGateway, RemoteGraphQLDataSource} from '@apollo/gateway';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';

/**
 * Starts a GraphQL Gateway connecting to GraphQL Servers
 * @param {int} port The first number.
 * @param {int} servers The second number.
 * @param {Boolean} verbose Enable verbose mode
 */
export default function startGateway(port: number, servers: string, verbose: Boolean = false) {
  if (verbose) console.info(`start server on :${port}`);

  const gateway = new ApolloGateway({
    serviceList: [{name: 'accounts', url: servers}],
    buildService({url}) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({request, context}) {
          request?.http?.headers.set('jwt', context.jwt);
        },
      });
    },
  });

  const server = new ApolloServer({
    gateway,
    context: ({req}) => {
      return {jwt: req.headers.jwt};
    },
    subscriptions: false,
  });

  const app = express();

  app.get('/alive', (req, res) => {
    console.log("alive")
    res.json({hello: 'I am alive!'});
  });

  app.get('/ready', (req, res) => {
    console.log("ready")
    res.json({hello: 'I am ready!'});
  });


  server.applyMiddleware({app});

  app.listen({port: port}, () =>
    console.log(
        `Gateway server started: http://localhost:${port}${server.graphqlPath}`,
    ),
  );
}
