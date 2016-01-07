/**
 * @file server
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import os from 'os';
import path from 'path';
import logger from '../lib/logger';
import program from 'commander';
import Proxy from '../lib/Proxy';
import extend from '../lib/util/extend';

const DEFAULT_LOG_PATH = path.resolve(os.homedir(), 'log', 'asuka');

/**
 * 启动代理服务器
 *
 * @param {Object=} options 配置参数
 * @param {number=} options.port 服务器端口号
 * @param {string=} options.log 日志目录
 * @param {string=} options.config 配置文件
 */
function start(options = {}) {
    if (options.config) {
        let file = path.resolve(process.cwd(), options.config);
        let config = require(file);
        if (config.log) {
            config.log = path.resolve(path.dirname(file), config.log);
        }
        options = extend(config, options);
    }

    let proxy = new Proxy(options);

    let log = logger(options.log || DEFAULT_LOG_PATH);
    log.info('asuka start', options);

    proxy.on('access', (e) => log.info('access', e));
    proxy.on('block', (e) => log.warn('block', e));
}

// 如果做为启动脚本运行
// 则从运行参数中获取参数启动 server
if (process.argv[1] + '.js' === __filename) {
    let options = JSON.parse(process.argv[2]);
    start(options);
}

export default start;
