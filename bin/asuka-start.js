/**
 * @file Start proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let program = require('commander');
let pm = require('../lib/util/pm');

program
    .option('-p, --port [port]', 'port')
    .option('-l, --log [path]', 'log path')
    .option('-c, --config [file]', 'config file')
    .parse(process.argv);

let path = require('path');

if (pm.get()) {
    console.error('asuka is running');
    process.exit(1);
}

let args = process.argv.slice(2);

pm.fork(path.resolve(__dirname, 'start-proxy'), args);

console.log('asuka start');
process.exit(0);
