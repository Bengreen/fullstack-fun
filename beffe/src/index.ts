#!/usr/bin/env node

import figlet from 'figlet';
import yargs from 'yargs';
import { cliCommand as gatewayFedCommand } from './gateway-fed';
import { cliCommand as gatewayStitchCommand } from './gateway-stitch';
import { cliCommand as oas2graphqlCommand } from './oas2graphql';

if (require.main === module) {
  console.log('index called directly');
  yargs
    .scriptName('beffe-server')
    .usage('$0 <cmd> [args]')
    .command(gatewayFedCommand)
    .command(gatewayStitchCommand)
    .command(oas2graphqlCommand)
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

}

