/**
 * @file Proxy Spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import url from 'url';
import http from 'http';
import https from 'https';
import Proxy from '../lib/Proxy';
import HttpsProxyAgent from 'https-proxy-agent';

const PORT = 8848;
const PROXY_URL = 'http://127.0.0.1:' + PORT;

describe('Proxy', () => {

    let proxy;

    afterEach(() => {
        proxy && proxy.close();
    });

    it('403', done => {
        proxy = new Proxy({port: PORT});
        http.get(PROXY_URL, res => {
            expect(res.statusCode).toEqual(403);
            done();
        });
    });

    it('access', done => {
        let accessEmitted = false;
        let blockEmitted = false;
        proxy = new Proxy({port: PORT});

        proxy.on('access', e => {
            expect(e.host).toEqual('www.taobao.com');
            expect(e.client.indexOf('127.0.0.1') >= 0).toBeTruthy();
            accessEmitted = true;
        });

        proxy.on('block', () => blockEmitted = true);

        let options = url.parse('https://www.taobao.com');
        options.agent = new HttpsProxyAgent(PROXY_URL);

        https.get(options, res => {
            expect(res.statusCode >= 200 && res.statusCode < 400).toBeTruthy;
            expect(accessEmitted).toBeTruthy();
            expect(blockEmitted).toBeFalsy();
            done();
        });
    });

    it('block everything', done => {
        let accessEmitted = false;
        let blockEmitted = false;
        proxy = new Proxy({port: PORT, hosts: []});

        proxy.on('block', e => {
            expect(e.host).toEqual('www.taobao.com');
            expect(e.client.indexOf('127.0.0.1') >= 0).toBeTruthy();
            blockEmitted = true;
        });

        proxy.on('access', () => accessEmitted = true);

        let options = url.parse('https://www.taobao.com');
        options.agent = new HttpsProxyAgent(PROXY_URL);

        https.get(options, res => {
            expect(res.statusCode).toEqual(403);
            expect(accessEmitted).toBeFalsy();
            expect(blockEmitted).toBeTruthy();
            done();
        });
    });

    it('access some website', done => {
        let accessEmitted = false;
        let blockEmitted = false;
        proxy = new Proxy({port: PORT, hosts: ['www.taobao.com']});

        proxy.on('block', e => {
            expect(e.host).toEqual('www.baidu.com');
            expect(e.client.indexOf('127.0.0.1') >= 0).toBeTruthy();
            blockEmitted = true;
        });

        proxy.on('access', e => {
            expect(e.host).toEqual('www.taobao.com');
            expect(e.client.indexOf('127.0.0.1') >= 0).toBeTruthy();
            accessEmitted = true;
        });

        let options = url.parse('https://www.baidu.com');
        options.agent = new HttpsProxyAgent(PROXY_URL);

        https.get(options, res => {
            expect(res.statusCode).toEqual(403);
            expect(accessEmitted).toBeFalsy();
            expect(blockEmitted).toBeTruthy();

            options = url.parse('https://www.taobao.com');
            options.agent = new HttpsProxyAgent(PROXY_URL);
            https.get(options, res => {
                expect(res.statusCode >= 200 && res.statusCode < 400).toBeTruthy;
                expect(accessEmitted).toBeTruthy();
                done();
            });
        });
    });

    it('access sub domain', done => {
        let accessEmitted = 0;
        let blockEmitted = 0;
        proxy = new Proxy({port: PORT, hosts: ['taobao.com']});

        proxy.on('block', e => {
            expect(e.host).toEqual('www.baidu.com');
            expect(e.client.indexOf('127.0.0.1') >= 0).toBeTruthy();
            blockEmitted++;
        });

        proxy.on('access', e => {
            expect(e.host.indexOf('taobao.com') >= 0).toBeTruthy();
            expect(e.client.indexOf('127.0.0.1') >= 0).toBeTruthy();
            accessEmitted++
        });

        let options = url.parse('https://www.baidu.com');
        options.agent = new HttpsProxyAgent(PROXY_URL);

        https.get(options, res => {
            expect(res.statusCode).toEqual(403);
            expect(accessEmitted).toEqual(0);
            expect(blockEmitted).toEqual(1);

            options = url.parse('https://www.taobao.com');
            options.agent = new HttpsProxyAgent(PROXY_URL);
            https.get(options, res => {
                expect(res.statusCode >= 200 && res.statusCode < 400).toBeTruthy;
                expect(accessEmitted).toEqual(1);
                expect(blockEmitted).toEqual(1);

                options = url.parse('https://style.taobao.com');
                options.agent = new HttpsProxyAgent(PROXY_URL);
                https.get(options, res => {
                    expect(res.statusCode >= 200 && res.statusCode < 400).toBeTruthy;
                    expect(accessEmitted).toEqual(2);
                    expect(blockEmitted).toEqual(1);
                    done();
                });
            });
        });
    });

});
