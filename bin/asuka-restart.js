/**
 * @file Start proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let path = require('path');
let pm = require('../lib/util/pm');

let info = pm.get();

if (!info) {
    console.error('asuka not run');
    process.exit(1);
}

try {
    process.kill(info.pid, 'SIGKILL');
    console.log('asuka stop');
}
catch (e) {
    console.error('can not stop asuka');
    process.exit(1);
}

pm.fork(path.resolve(__dirname, 'start-proxy'), info.args, info.cwd);

console.log('asuka start');
process.exit(0);
