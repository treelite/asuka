/**
 * @file Start proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import program from 'commander';
import start from './start-proxy';
import * as pm from '../lib/util/pm';

program
    .option('-p, --port [port]', 'port')
    .option('-l, --log [path]', 'log path')
    .option('-c, --config [file]', 'config file')
    .option('-f, --foreground', 'run server in foreground')
    .parse(process.argv);

if (pm.get()) {
    console.error('asuka is running');
    process.exit(1);
}

let options = {};
let cpy = key => program[key] && (options[key] = program[key]);
['port', 'log', 'config'].forEach(cpy);

if (program.foreground) {
    start(options);
    console.log('asuka start');
}
else {
    let path = require('path');
    pm.fork(path.resolve(__dirname, 'start-proxy'), [JSON.stringify(options)]);
    console.log('asuka start');
    process.exit(0);
}
