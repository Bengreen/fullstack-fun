/* eslint-disable max-len */
import express from 'express';
import yargs, { command } from 'yargs';
import figlet from 'figlet';
import yaml from 'js-yaml';
import fs from 'fs';

import * as http from 'http';
import got from 'got';
import * as OtG from 'openapi-to-graphql';
import { Oas3 } from 'openapi-to-graphql/lib/types/oas3';

import {
    ApolloServer,
} from 'apollo-server-express';

// import { ApolloServer } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';


import { gql } from 'apollo-server';
import { introspectionFromSchema, printSchema } from 'graphql';

const typeDefs = gql`
  """
  This is the account info for the users
  """


  type Query {
    """
    Query an account by id
    """
    roy: String
  }
`;
const resolvers = {
    Query: {
        roy: () => 'roy',
    },
};





interface IOasServer {
    name: string,
    url: string,
    baseUrl: string
}

interface IOasServerConf {
    servers: IOasServer[];
}


function builder(yargs: yargs.Argv<{}>) {
    // console.log('gatewayCLI called with ',yargs);
    return yargs
        .env('OAS')
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
            default: 4002,
            describe: 'Port for oas2graphql'
        })
        .help();
}

function handler(argv: any) {
    console.log(`Reading config from: ${argv.file}`);

    const serverFile = fs.readFileSync(String(argv.file), 'utf8');
    const serverConf = yaml.safeLoad(serverFile) as IOasServerConf;

    serverConf.servers.forEach((server) => {
        console.log(server);
    })

    startOas2graphql(Number(argv.port), String(argv.path), serverConf.servers, Boolean(argv.verbose));

}

async function startOas2graphql(
    port: number,
    path: string,
    servers: IOasServer[],
    verbose: Boolean = false) {
    console.log(figlet.textSync('oas2graphql 1.0', 'Rectangles'));

    if (verbose) console.info(`start server on :${port}`);

    var oasSchemas = await Promise.all(servers.map(async (server): Promise<Oas3> => {
        console.log(`Getting oas: ${server.name} = ${server.url}`);
        let reply = await got(server.url).json();

        return reply as Oas3;
    }));

    console.log(`oas IS = `, oasSchemas);

    let gqlServerDef = await OtG.createGraphQLSchema(oasSchemas, { baseUrl: servers[0].baseUrl });
    // ToDo: Move specification of the server url into the oas spec itself and not have to override here
    const { schema } = gqlServerDef;

    // console.log('GQL = ', printSchema(schema));
    // var abc = introspectionFromSchema(schema);
    // console.log('Introspection = ', abc);
    // const def = schema.getTypeMap();

    // console.log('typemap = ', def);
    // const ghi = makeExecutableSchema({typeDefs: printSchema(schema), resolvers: def})

    const server = new ApolloServer({ schema });

    //https://www.apollographql.com/blog/three-ways-to-represent-your-graphql-schema-a41f4175100d/
    //https://github.com/apollographql/apollo-server/pull/4310
    // https://github.com/0xR/graphql-transform-federation
    // const serverFederated = new ApolloServer({
    //     schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    // });

    console.log(`gql = `, gqlServerDef);

    const app = express();

    app.get('/alive', (req, res) => {
        console.log("alive")
        res.json({ hello: 'I am alive!' });
    });

    app.get('/ready', (req, res) => {
        console.log("ready")
        res.json({ hello: 'I am ready!' });
    });


    // serverFederated.applyMiddleware({ app, path: path });

    server.applyMiddleware({ app, path: path });


    app.listen({ port: port }, () =>
        console.log(
            `OAS server started: http://localhost:${port}${path}`,
        ),
    );
}


export const cliCommand = {
    command: 'oas2graphql',
    aliases: '',
    describe: 'Create a oas2graphql transform and serve',
    builder: builder,
    handler: handler,
    deprecated: false
}


if (require.main === module) {
    cliCommand.handler(cliCommand.builder(yargs).argv);
}
