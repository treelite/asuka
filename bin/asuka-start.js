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
let pidFile = path.resolve(__dirname, 'pid');

if (exists(pidFile)) {
    console.error('asuka is running');
    return;
}

let child = fork(path.resolve(__dirname, 'start-proxy'), process.argv.slice(2));
fs.writeFileSync(pidFile, child.pid);
child.disconnect();

console.log('asuka start');
process.exit(0);
