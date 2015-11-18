/**
 * @file Stop server
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let fs = require('fs');
let path = require('path');
let exists = require('../lib/exists');
let pidFile = path.resolve(__dirname, 'pid');


if (!exists(pidFile)) {
    console.error('server not run');
    return;
}

let pid = fs.readFileSync(pidFile, 'utf8');

try {
    process.kill(parseInt(pid, 10), 'SIGKILL')
    fs.unlinkSync(pidFile);
    console.log('server stop');
}
catch (e) {
    console.error('can not stop server')
}
