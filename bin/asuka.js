/**
 * @file Start proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import program from 'commander';

let info = fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8');
info = JSON.parse(info);

program
    .version(info.version)
    .command('start', 'start proxy server')
    .command('restart', 'restart proxy server')
    .command('stop', 'stop proxy server')
    .parse(process.argv);
