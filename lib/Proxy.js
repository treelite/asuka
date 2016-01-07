/**
 * @file HTTPS proxy
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import net from 'net';
import http from 'http';
import EventEmitter from 'events';

/**
 * HTTP Reson
 *
 * @const
 * @type {Object}
 */
const Reason = {
    200: 'OK',
    403: 'Forbidden'
};

/**
 * 文本文件编码方式
 *
 * @const
 * @type {string}
 */
const ENCODING = 'utf8';

/**
 * HTTPS 的默认端口
 *
 * @const
 * @type {number}
 */
const HTTPS_PORT = 443;

/**
 * 代理服务器默认端口
 *
 * @const
 * @type {number}
 */
const DEFAULT_PORT = 8777;

/**
 * 构建 HTTP header
 *
 * @private
 * @param {number} status HTTP Code
 * @param {string=} reason HTTP Reason
 * @param {Object=} headers HTTP headers
 * @return {string}
 */
function writeHeader(status, reason = Reason[status], headers) {
    let res = [];
    res.push(['HTTP/1.1', status, reason].join(' '));
    if (headers) {
        Object.keys(headers).forEach((key) => {
            res.push(key + ': ' + headers[key]);
        });
    }

    res = res.join('\r\n');

    return res + '\r\n\r\n';
}

/**
 * 响应 HTTP
 *
 * @private
 * @param {Object} socket 请求的 socket
 * @param {number} status HTTP code
 * @param {string=} reason HTTP Reason
 * @param {Object=} headers HTTP headers
 * @return {Promise}
 */
function response(socket, status, reason, headers) {
    return new Promise(
        (resolve, reject) => socket.write(
            writeHeader(status, headers, reason),
            ENCODING,
            (error) => error ? reject(error) : resolve()
        )
    );
}

/**
 * 检查站点是否在白名单中
 *
 * @private
 * @param {string} host 访问的站点
 * @param {Array.<string>} list 站点白名单
 * @return {boolean}
 */
function checkHost(host, list) {
    return list.some(name => name === host || host.lastIndexOf('.' + name) > 0);
}

/**
 * 拒绝访问 HTTP 403
 *
 * @private
 * @param {Object} req HTTP 请求对象
 * @param {Object} res HTTP 响应对象
 */
function forbid(req, res) {
    res.writeHead(403);
    res.end();
}

/**
 * 代理服务器
 *
 * @public
 * @class
 */
class Proxy extends EventEmitter {

    /**
     * 构造函数
     *
     * @constructor
     * @param {Object=} options 配置参数
     * @param {number=} options.port 代理服务器端口
     * @param {Array.<string>=} options.hosts 站点白名单
     */
    constructor(options) {
        super();
        options = this.options = options || {};
        let server = this.server = http.createServer();
        server.on('connect', this.connectHandler.bind(this));
        server.on('request', forbid);
        server.listen(options.port || DEFAULT_PORT);
    }

    /**
     * 关闭服务器
     *
     * @public
     */
    close() {
        if (this.server) {
            this.server.close();
        }
    }

    /**
     * 处理 connect 请求
     *
     * @private
     * @param {Object} req 请求对象
     * @param {Object} socket 请求的 socket 对象
     */
    connectHandler(req, socket) {
        let url = req.url.split(':');
        let host = url[0];
        let port = url[1] || HTTPS_PORT;

        if (this.options.hosts && !checkHost(host, this.options.hosts)) {
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

export default Proxy;
