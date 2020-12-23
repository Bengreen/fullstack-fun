import yargs from 'yargs';



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


export function startOas2graphql(
    port: number,
    path: String,
    servers: IOasServer[],
    verbose: Boolean = false) {
    if (verbose) console.info(`start server on :${port}`);

    console.log('Hello');
}

