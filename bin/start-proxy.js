/**
 * @file server
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

const DEFAULT_LOG_PATH = '/usr/log/asuka';

let path = require('path');
let logger = require('../lib/logger');
let program = require('commander');
let Proxy = require('../lib/Proxy');
let extend = require('../lib/util/extend');

program
    .option('-p, --port', 'port')
    .option('-l, --log', 'log path')
    .option('-c, --config', 'config file')
    .parse(process.argv);

let log = logger(program.log || DEFAULT_LOG_PATH);

let options = {};
if (program.port) {
    options.port = program.port;
}
if (program.config) {
    let config = path.resolve(process.cwd(), program.config);
    config = require(config);
    options = extend(config, options);
}
let proxy = new Proxy(options);

log.info('asuka start');

proxy.on('access', (e) => log.info('access', e));
proxy.on('block', (e) => log.warn('block', e));
