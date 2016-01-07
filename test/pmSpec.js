/**
 * @file PM spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import * as pm from '../lib/util/pm';

const FILE = path.resolve(__dirname, '..', 'pid');

describe('pm', () => {

    beforeEach(() => {
        fs.writeFileSync(FILE, JSON.stringify({pid: 100}), 'utf8');
    });

    it('get', () => {
        expect(pm.get()).toBeNull();
    });

    it('fork', done => {
        let args = [500];
        let cmd = path.resolve(__dirname, './mock/timeout');
        pm.fork(cmd, args);
        let info = pm.get();
        expect(info.pid).not.toEqual(100);
        expect(info.args).toEqual(args);
        expect(info.cwd).toEqual(process.cwd());
        expect(info.file).toEqual(cmd);
        setTimeout(
            () => {
                expect(pm.get()).toBeNull();
                done();
            },
            700
        );
    });
});
