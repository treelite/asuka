/**
 * @file Start proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let fs = require('fs');
let path = require('path');
let fork = require('child_process').fork;
let exists = require('../lib/util/exists');
let infoFile = path.resolve(__dirname, 'pinfo');

if (!exists(infoFile)) {
    console.error('asuka not run');
    process.exit(1);
}

let info = JSON.parse(fs.readFileSync(infoFile, 'utf8'));

try {
    process.kill(parseInt(info.pid, 10), 'SIGKILL');
    console.log('asuka stop');
}
catch (e) {
    console.error('can not stop asuka');
    process.exit(1);
}

let child = fork(
    path.resolve(__dirname, 'start-proxy'),
    info.args,
    {
        cwd: info.cwd
    }
);
info.pid = child.pid;
fs.writeFileSync(infoFile, JSON.stringify(info));
child.disconnect();

console.log('asuka start');
process.exit(0);
