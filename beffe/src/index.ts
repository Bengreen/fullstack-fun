#!/usr/bin/env node

import figlet from 'figlet';
import yargs from 'yargs';
import startGateway from './gateway';

yargs
    .scriptName('beffe-server')
    .usage('$0 <cmd> [args]')
    .command(
        'gateway [port]',
        'start the gateway',
        (yargs) => {
          yargs.positional('port', {
            describe: 'port to bind on',
            default: 4000,
            type: 'number',
          });
        },
        (argv) => startGateway(Number(argv.port), 'http://localhost:4001', Boolean(argv.verbose)),
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
