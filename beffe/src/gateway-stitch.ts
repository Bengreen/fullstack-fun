/* eslint-disable max-len */
import express from 'express';
import yargs from 'yargs';
import figlet from 'figlet';
import yaml from 'js-yaml';
import fs from 'fs';

import { mergeSchemas, makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools';
import { createHttpLink } from 'apollo-link-http';
import { ApolloServer } from 'apollo-server-express';
import fetch from 'cross-fetch';


export interface IServer {
    name: string;
    url: string;
}

export interface IGatewayStitchConf {
    servers: IServer[];
}




export function gatewayStitchCli(yargs: yargs.Argv<{}>) {
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

export async function gatewayStitchStart(argv: any) {

    console.log(figlet.textSync('beffe stitch 1.0', 'Rectangles'));

    console.log(`Reading config from: ${argv.file}`);

    const serverFile = fs.readFileSync(String(argv.file), 'utf8');
    const serverConf = yaml.safeLoad(serverFile) as IGatewayStitchConf;

    serverConf.servers.forEach((server) => {
      console.log(server);
    });

    await startGatewayStitch(Number(argv.port), serverConf.servers, String(argv.path), Boolean(argv.verbose));
 
}

/* Copied from https://github.com/supercycle91/graphql-microservices-example/blob/master/main-api/introspection.js
*/
async function getIntrospectSchema(url: string) {
    // Create a link to a GraphQL instance by passing fetch instance and url
    console.log('doing http with ', url);
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


export async function startGatewayStitch(
    port: number,
    servers: IServer[],
    path: string,
    verbose: Boolean = false
) {
    if (verbose) console.info(`start server on :${port}`);

    let allSchemas = await Promise.all(servers.map(server => getIntrospectSchema(server.url)));
    const server = new ApolloServer({
        schema: mergeSchemas({ schemas: allSchemas })
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

    server.applyMiddleware({app, path: path});

    app.listen({ port: port }, () =>
        console.log(
            `Gateway Stitch server started: http://localhost:${port}${server.graphqlPath}`,
        ),
    );
}


export const stitchCli = {
    command: 'gateway-stitch [port]',
    aliases: '',
    describe: 'my command does this',
    builder: gatewayStitchCli,
    handler: gatewayStitchStart,
    deprecated: false
}

if (require.main === module) {
    console.log('gatewayStich called directly');

} else {
    console.log('gatewayStich required as a module');
}
