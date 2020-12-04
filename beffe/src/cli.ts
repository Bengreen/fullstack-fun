#!/usr/bin/env node

import * as yargs from 'yargs';
import * as figlet from 'figlet';
import {server} from './server';

const { argv } = yargs
    .scriptName("pirate-parser")
    .usage('$0 <cmd> [args]')
    .command('hello [name]', 'welcome ter yargs!', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: 'Cambi',
            describe: 'the name to say hello to'
        })
        }, (argv) => {
            console.log('hello', argv.name, 'welcome to yargs!')
            console.log(argv);
        })
    .command('logo', 'Create my logo', (yargs) => {
        yargs
            .version('1.x')
        }, (argv) => {
            console.log('got here');
            console.log(figlet.textSync("ml8s_2.0", {
                font: 'Rectangles'
            }));
        }
    )
    .command('serve', 'Serve a simple App', (yargs) => {
        yargs;
    }, (yargs) => {
        console.log("Running this yargs", yargs);
        server();
    })
    .help()
    .argv;
