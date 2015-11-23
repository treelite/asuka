/**
 * @file Stop server
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let fs = require('fs');
let path = require('path');
let exists = require('../lib/util/exists');
let infoFile = path.resolve(__dirname, 'pinfo');


if (!exists(infoFile)) {
    console.error('asuka not run');
    process.exit(1);
}

let info = JSON.parse(fs.readFileSync(infoFile, 'utf8'));

try {
    process.kill(parseInt(info.pid, 10), 'SIGKILL');
    fs.unlinkSync(infoFile);
    console.log('asuka stop');
}
catch (e) {
    console.error('can not stop asuka');
}
