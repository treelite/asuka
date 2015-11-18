/**
 * @file Start proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let program = require('commander');

program
    .option('-p, --port', 'port')
    .option('-l, --log', 'log path')
    .option('-c, --config', 'config file')
    .parse(process.argv);

let fs = require('fs');
let path = require('path');
let exists = require('../lib/exists');
let fork = require('child_process').fork;
let pidFile = path.resolve(__dirname, 'pid');

if (exists(pidFile)) {
    console.error('server is running');
    return;
}

let child = fork(path.resolve(__dirname, 'start-proxy'), process.argv.slice(2));
fs.writeFileSync(pidFile, child.pid);
child.disconnect();

console.log('server start');
process.exit(0);
