/* eslint-disable max-len */
import express from 'express';
import yargs, { command } from 'yargs';
import figlet from 'figlet';
import yaml from 'js-yaml';
import fs from 'fs';

import { mergeSchemas, makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools';
import { createHttpLink } from 'apollo-link-http';
import { ApolloServer } from 'apollo-server-express';
import fetch from 'cross-fetch';

interface IServer {
    name: string;
    url: string;
}

interface IGatewayStitchConf {
    servers: IServer[];
}


function builder(yargs: yargs.Argv<{}>) {
    // console.log('gatewayCLI called with ',yargs);
    return yargs
        .env('STITCH')
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

    console.log(figlet.textSync('beffe stitch 1.0', 'Rectangles'));

    console.log(`Reading config from: ${argv.file}`);

    const serverFile = fs.readFileSync(String(argv.file), 'utf8');
    const serverConf = yaml.safeLoad(serverFile) as IGatewayStitchConf;

    serverConf.servers.forEach((server) => {
        console.log(server);
    });

    await startGatewayStitch(Number(argv.port), String(argv.path), serverConf.servers, Boolean(argv.verbose));
}


/* Copied from https://github.com/supercycle91/graphql-microservices-example/blob/master/main-api/introspection.js
*/
async function getIntrospectSchema(url: string) {
    // Create a link to a GraphQL instance by passing fetch instance and url
    const makeServiceLink = () => createHttpLink({
        uri: url,
        fetch
    });

    // Fetch our schema
    const databaseServiceSchemaDefinition = await introspectSchema(makeServiceLink());

    // make an executable schema
    return makeRemoteExecutableSchema({
        schema: databaseServiceSchemaDefinition,
        link: makeServiceLink()
    });
}


async function startGatewayStitch(
    port: number,
    path: string,
    servers: IServer[],
    verbose: Boolean = false
) {
    if (verbose) console.info(`start server on :${port}`);

    let allSchemas = await Promise.all(servers.map(server => getIntrospectSchema(server.url)));
    let mergedSchemas = mergeSchemas({ schemas: allSchemas });
    console.log(`Schemas = `, mergedSchemas);

    const server = new ApolloServer({
        schema: mergedSchemas
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
            `Gateway Stitch server: http://localhost:${port}${server.graphqlPath}`,
        ),
    );
}


export const cliCommand = {
    command: 'gateway-stitch [port]',
    aliases: '',
    describe: 'Create a stitch GraphQL merge and serve',
    builder: builder,
    handler: handler,
    deprecated: false
}


if (require.main === module) {
    cliCommand.handler(cliCommand.builder(yargs).argv);
}
