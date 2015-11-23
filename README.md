# asuka

mini HTTPS proxy

简单的 HTTPS 代理服务器，依赖于 node 5.0 及其以上版本

## Usage

```sh
$ npm install -g asuka
$ asuka

  Usage: asuka [options] [command]


  Commands:

    start       start proxy server
    restart     restart proxy server
    stop        stop proxy server
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## API

### Proxy(options)

创建代理服务器对象

* **options** `{Object=}` 配置信息
    * **port** `{Number=}` 代理服务器端口，默认为 8777
    * **hosts** `{Array.<string>=}` 允许访问的站点列表，如果为空则不限制访问站点

```js
let Proxy = require('asuka');
// 设置端口在 8787 并且只能访问 github.com
let proxy = new Proxy({port: 8787, hosts: ['github.com']});
```

### access

代理请求访问事件

* **e** `{Object}` 事件参数
    * **host** `{string}` 访问站点
    * **client** `{string}` 客户端 IP

### block

代理请求屏蔽事件

* **e** `{Object}` 事件参数
    * **type** `{string}` 屏蔽理由，目前有 `host` 表示站点白名单限制 不允许访问
    * **host** `{string}` 访问站点
    * **client** `{string}` 客户端 IP
