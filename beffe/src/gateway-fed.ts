/* eslint-disable max-len */
import express from 'express';
import yargs, { command } from 'yargs';
import figlet from 'figlet';
import yaml from 'js-yaml';
import fs from 'fs';


import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';



export interface IServer {
  name: string;
  url: string;
}

interface IGatewayFedConf {
  servers: IServer[];
}



function builder(yargs: yargs.Argv<{}>) {
  // console.log('gatewayCLI called with ',yargs);
  return yargs
    .env('FED')
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


async function handler(argv: any) {

  console.log(figlet.textSync('beffe fed 1.0', 'Rectangles'));

  console.log(`Reading config from: ${argv.file}`);

  const serverFile = fs.readFileSync(String(argv.file), 'utf8');
  const serverConf = yaml.safeLoad(serverFile) as IGatewayFedConf;

  serverConf.servers.forEach((server) => {
    console.log(server);
  });

  await startGatewayFed(Number(argv.port), String(argv.path), serverConf.servers, Boolean(argv.verbose));
}



/**
 * Starts a GraphQL Gateway connecting to GraphQL Servers
 * @param {int} port The first number.
 * @param {int} servers The second number.
 * @param {Boolean} verbose Enable verbose mode
 */
export function startGatewayFed(
  port: number,
  path: string,
  servers: IServer[],
  verbose: Boolean = false) {
  if (verbose) console.info(`start server on :${port}`);

  const gateway = new ApolloGateway({
    // serviceList: [{name: 'accounts', url: servers}],
    serviceList: servers,
    debug: true,
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          request?.http?.headers.set('jwt', context.jwt);
        },
      });
    },
  });

  const server = new ApolloServer({
    gateway,
    context: ({ req }) => {
      return { jwt: req.headers.jwt };
    },
    subscriptions: false,
  });

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
      `Gateway server started: http://localhost:${port}${server.graphqlPath}`,
    ),
  );
}



export const cliCommand = {
  command: 'gateway-fed [port]',
  aliases: '',
  describe: 'Create a federated GraphQL merge and serve',
  builder: builder,
  handler: handler,
  deprecated: false
}

if (require.main === module) {
  cliCommand.handler(cliCommand.builder(yargs).argv);
}
