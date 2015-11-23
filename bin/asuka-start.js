/**
 * @file Start proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let program = require('commander');

program
    .option('-p, --port [port]', 'port')
    .option('-l, --log [path]', 'log path')
    .option('-c, --config [file]', 'config file')
    .parse(process.argv);

let fs = require('fs');
let path = require('path');
let fork = require('child_process').fork;
let exists = require('../lib/util/exists');
let infoFile = path.resolve(__dirname, 'pinfo');

if (exists(infoFile)) {
    console.error('asuka is running');
    process.exit(1);
}

let args = process.argv.slice(2);
let child = fork(path.resolve(__dirname, 'start-proxy'), args);
fs.writeFileSync(infoFile, JSON.stringify({pid: child.pid, args: args, cwd: process.cwd()}));
child.disconnect();

console.log('asuka start');
process.exit(0);
