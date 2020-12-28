import yargs from 'yargs';
import figlet from 'figlet';
import * as http from 'http';
import got from 'got';
// const { createGraphQLSchema } = require("openapi-to-graphql");
import * as OtG from 'openapi-to-graphql';
// const OtG = require('openapi-to-graphql')


if (require.main === module) {
    console.log('oas2graphql called directly');
} else {
    console.log('oas2graphql required as a module');
}

export interface IOasServer {
    name: string,
    url: string
}

export interface IOasServerConf {
    servers: IOasServer[];
}


export function oas2graphqlCli(yargs: yargs.Argv<{}>) {
    // console.log('gatewayCLI called with ',yargs);
    return yargs
        .env('OAS2')
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


export async function startOas2graphql(
    port: number,
    path: String,
    servers: IOasServer[],
    verbose: Boolean = false) {
    console.log(figlet.textSync('oas2graphql 1.0', 'Rectangles'));

    if (verbose) console.info(`start server on :${port}`);

    console.log('Hello');

    var schemas = await Promise.all(servers.map(async (server) => {
        console.log(`Pulling GOT server ${server.name} = ${server.url}`);
        let reply = await got(server.url).json();
        // console.log(`REPLY = ${reply}`);
        
        return reply;
    }));

    console.log(`oas IS = `, schemas);

    var gqls = schemas.map(async (oas: any) => {
        const { schema } = await OtG.createGraphQLSchema(oas);

        console.log(`Looking at this schema ${schema}`);
    });

    // servers.forEach((server) => {
    //     console.log(`Pulling server ${server.name} = ${server.url}`);

    //     http.get(server.url, (res) => {
    //         let data = '';
    //         // const { statusCode } = res;

    //         console.log(`File is ${res}`);

    //         // A chunk of data has been recieved.
    //         res.on('data', (chunk) => {
    //             data += chunk;
    //         });

    //         // The whole response has been received. Print out the result.
    //         res.on('end', async () => {
    //             console.log(`OAS = ${data}`);
    //             const dataJson = JSON.parse(data);
    //             const { schema } = await OtG.createGraphQLSchema(dataJson);

    //             console.log(`Looking at this schema ${schema}`);
    //         });

    //     }).on("error", (err) => {
    //         console.log("Error: " + err.message);
    //     });
    // });







}

