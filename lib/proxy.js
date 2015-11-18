/**
 * @file HTTPS proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

let net = require('net');
let http = require('http');

function proxy(options) {
    let server = http.createServer();

    function response(socket, status, reason, headers) {
        let res = [];
        res.push(['HTTP/1.1', status, reason].join(' '));
        if (headers) {
            Object.keys(headers).forEach((key) => {
                res.push(key + ': ' + headers[key]);
            });
        }

        res = res.join('\r\n');

        console.log('response:');
        console.log(res);

        return new Promise((resolve, reject) => {
            socket.write(res + '\r\n\r\n',  'utf-8', (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }

    server.on('connect', (req, socket) => {
        let url = req.url;
        console.log(url);

        url = url.split(':');

        let tunnel = net.createConnection(
            {
                host: url[0],
                port: url[1] || 443
            },
            () => {
                response(
                    socket,
                    200,
                    'Connection established',
                    {
                        Connection: 'keep-alive'
                    }
                ).then(() => {
                    tunnel.pipe(socket);
                    socket.pipe(tunnel);
                    console.log(url + ' success');
                }).catch((e) => {
                    console.log('response error');
                    console.log(e);
                    tunnel.end();
                    socket.end();
                });
            }
        );

        tunnel.setNoDelay(true);

        tunnel.on('error', (e) => {
            console.log('tunnel error');
            console.log(e);
        });

        tunnel.on('connect', () => {
            console.log('tunnel connection');
        });

        tunnel.on('data', () => {
            console.log('received data');
        });

        tunnel.on('timeout', () => {
            console.log('timeout');
        });
    });


    server.listen(options.port);
}

module.exports = proxy;
