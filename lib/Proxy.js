/**
 * @file HTTPS proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

const Reason = {
    200: 'OK',
    403: 'Forbidden'
};
const ENCODING = 'utf8';
const HTTPS_PORT = 443;
const DEFAULT_PORT = 8777;

let net = require('net');
let http = require('http');
let EventEmitter = require('events');

function writeHeader(status, reason, headers) {
    let res = [];
    reason = reason || Reason[status];
    res.push(['HTTP/1.1', status, reason].join(' '));
    if (headers) {
        Object.keys(headers).forEach((key) => {
            res.push(key + ': ' + headers[key]);
        });
    }

    res = res.join('\r\n');

    return res + '\r\n\r\n';
}

function response(socket, status, reason, headers) {
    return new Promise(
        (resolve, reject) => socket.write(
            writeHeader(status, headers, reason),
            ENCODING,
            (error) => error ? reject(error) : resolve()
        )
    );
}

function checkHost(host, list) {
    list = list || [];
    if (!list.length) {
        return true;
    }
    return list.indexOf(host) >= 0;
}

function forbid(req, res) {
    res.writeHead(403);
    res.end();
}

class Proxy extends EventEmitter {
    constructor(options) {
        super();
        options = this.options = options || {};
        let server = this.server = http.createServer();
        server.on('connect', this.connectHandler.bind(this));
        server.on('request', forbid);
        server.listen(options.port || DEFAULT_PORT);
    }

    connectHandler(req, socket) {
        let url = req.url.split(':');
        let host = url[0];
        let port = url[1] || HTTPS_PORT;

        if (!checkHost(host, this.options.hosts)) {
            socket.end(writeHeader(403), ENCODING);
            this.emit('block', {type: 'host', host: host, client: socket.remoteAddress});
            return;
        }

        this.emit('access', {host: host, client: socket.remoteAddress});

        let tunnel = net.createConnection(
            {host, port},
            () => response(
                socket,
                200,
                'Connection established',
                {
                    Connection: 'keep-alive'
                }
            ).then(() => tunnel.pipe(socket).pipe(tunnel))
        );

        tunnel.setNoDelay(true);
    }
}

module.exports = Proxy;
