/* eslint-disable max-len */
import {ApolloGateway, RemoteGraphQLDataSource} from '@apollo/gateway';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import yargs from 'yargs';


export interface IServer {
  name: string;
  url: string;
}

export interface IGatewayFedConf {
  servers: IServer[];
}


if (require.main === module) {
  console.log('gatewayFed called directly');
} else {
  console.log('gatewayFed required as a module');
}


export function gatewayFedCli(yargs: yargs.Argv<{}>) {
  // console.log('gatewayCLI called with ',yargs);
  return yargs
    .env('GATEWAY')
    .option('path', {
      default: '/graphql',
      describe: 'Path to serve GraphQL'
    })
    .option('file', {
      alias: 'f',
      demandOption: "config file is required.",
      // default: '',
      describe: 'File for config'
    })
    .option('port', {
      alias: 'p',
      default: 4000,
      describe: 'Port for gateway'
    })
    .help();
}



/**
 * Starts a GraphQL Gateway connecting to GraphQL Servers
 * @param {int} port The first number.
 * @param {int} servers The second number.
 * @param {Boolean} verbose Enable verbose mode
 */
export function startGatewayFed(
  port: number,
  servers: IServer[],
  path: string,
  verbose: Boolean = false) {
  if (verbose) console.info(`start server on :${port}`);

  const gateway = new ApolloGateway({
    // serviceList: [{name: 'accounts', url: servers}],
    serviceList: servers,
    debug: true,
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


  server.applyMiddleware({app, path: path});

  app.listen({port: port}, () =>
    console.log(
        `Gateway server started: http://localhost:${port}${server.graphqlPath}`,
    ),
  );
}
