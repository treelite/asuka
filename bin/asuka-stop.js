/**
 * @file Stop server
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let fs = require('fs');
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
}
