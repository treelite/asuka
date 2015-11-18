/**
 * @file CLI
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let program = require('commander');
let info = require('../package.json');

program
    .version(info.version)
    .command('start [config_file]', 'start proxy server')
    .command('restart [config_file]', 'restart proxy server')
    .command('stop', 'stop proxy server')
    .parse(process.argv);
