#!/usr/bin/env node

import figlet from 'figlet';
import yargs from 'yargs';
import { startGateway, IServerConf, gatewayCli } from './gateway';
import yaml from 'js-yaml';
import fs from 'fs';
import { IOasServerConf, oas2graphqlCli, startOas2graphql } from './oas2graphql';


if (require.main === module) {
  console.log('index called directly');
} else {
  console.log('index required as a module');
}

yargs
    .scriptName('beffe-server')
    .usage('$0 <cmd> [args]')
    .command(
        'gateway [port]',
        'start the gateway',
        (yargs) => gatewayCli(yargs),
        (argv) => {
          console.log(figlet.textSync('beffe 1.0', 'Rectangles'));
          
          console.log(`Reading config from: ${argv.file}`);

          const serverFile = fs.readFileSync(String(argv.file), 'utf8');
          const serverConf = yaml.safeLoad(serverFile) as IServerConf;

          serverConf.servers.forEach((server) => {
            console.log(server);
          })


          startGateway(Number(argv.port), serverConf.servers , String(argv.path), Boolean(argv.verbose));
      },
    )
    .command(
      'oas2graphql [port]',
      'start the oas2graphql',
      (yargs) => oas2graphqlCli(yargs),
      (argv) => {
        console.log(`Reading config from: ${argv.file}`);
        
        const serverFile = fs.readFileSync(String(argv.file), 'utf8');
        const serverConf = yaml.safeLoad(serverFile) as IOasServerConf;

        serverConf.servers.forEach((server) => {
          console.log(server);
        })


        startOas2graphql(Number(argv.port), String(argv.path), serverConf.servers,  Boolean(argv.verbose));

      }
    )
    .command('logo', 'Show the logo', (yargs) => {
      console.log(figlet.textSync('beffe 1.0', 'Rectangles'));
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .help()
    .showHelpOnFail(true)
    .demandCommand(1, '').argv;
