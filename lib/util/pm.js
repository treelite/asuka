/**
 * @file Process manager
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import exists from './exists';
import {fork as _fork, execSync} from 'child_process';

const FILE = path.resolve(__dirname, '../../pid');

function isRunning(pid) {
    let res = execSync(`ps aux | grep ${pid}`);
    return res && res.indexOf('start-proxy') >= 0;
}

/**
 * 获取当前运行进程的信息
 *
 * @public
 * @return {!Object}
 */
export function get() {
    if (!exists(FILE)) {
        return null;
    }

    let info = JSON.parse(fs.readFileSync(FILE, 'utf8'));

    return isRunning(info.pid) ? info : null;
}

/**
 * 启动新进程
 *
 * @public
 * @param {string} file 文件路径
 * @param {Array} args 进程启动参数
 * @param {string=} cwd 进程启动路径
 */
export function fork(file, args, cwd) {
    cwd = cwd || process.cwd();
    let child = _fork(file, args, {cwd});
    fs.writeFileSync(FILE, JSON.stringify({pid: child.pid, args: args, cwd: cwd}));
    child.disconnect();
}
