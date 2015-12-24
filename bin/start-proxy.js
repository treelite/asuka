/**
 * @file server
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let os = require('os');
let path = require('path');
let logger = require('../lib/logger');
let program = require('commander');
let Proxy = require('../lib/Proxy');
let extend = require('../lib/util/extend');

const DEFAULT_LOG_PATH = path.resolve(os.homedir(), 'log', 'asuka');

program
    .option('-p, --port [port]', 'port')
    .option('-l, --log [path]', 'log path')
    .option('-c, --config [file]', 'config file')
    .parse(process.argv);

let options = {
    port: program.port
};
if (program.config) {
    let file = path.resolve(process.cwd(), program.config);
    let config = require(file);
    if (config.log) {
        config.log = path.resolve(path.dirname(file), config.log);
    }
    options = extend(config, options);
}
let proxy = new Proxy(options);

let log = logger(program.log || options.log || DEFAULT_LOG_PATH);
log.info('asuka start', options);

proxy.on('access', (e) => log.info('access', e));
proxy.on('block', (e) => log.warn('block', e));
