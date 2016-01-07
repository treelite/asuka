# asuka

mini HTTPS proxy

简单的 HTTPS 代理服务器，依赖于 node 5.0 及其以上版本

## Usage

```sh
$ npm install -g asuka

# 启动服务器
$ asuka start

# 停止服务器
$ asuka stop
```

服务器默认使用 `8777` 端口并将日志保存在 `$HOME/log/asuka` 文件夹下

## Command

### start

启动服务器

```sh
Usage: asuka-start [options]

  Options:

    -h, --help           output usage information
    -p, --port [port]    port
    -l, --log [path]     log path
    -c, --config [file]  config file
```

配置文件为 `JSON` 文件，可包含以下信息：

* **port** `{number}` 服务器的端口号
* **log** `{string}` 日志路径
* **hosts** `{Array.<string>}` 允许访问的站点列表，如果为空则不限制访问的站点

```js
{
    "port": 8848,
    "log": "/var/log/asuka",
    "hosts": ["registry.npmjs.org"]
}
```

### stop

停止服务器

### restart

重启服务器

## API

### Proxy(options)

创建代理服务器对象

* **options** `{Object=}` 配置信息
    * **port** `{Number=}` 代理服务器端口，默认为 8777
    * **hosts** `{Array.<string>=}` 允许访问的站点列表（向下包含子域名），如果不设置则不限制访问的站点

```js
import Proxy from 'asuka';

// 设置端口在 8787 并且只能访问 github.com
let proxy = new Proxy({port: 8787, hosts: ['github.com']});
```

### Methods

#### close()

关闭服务器

### Events

#### access

代理请求访问事件

* **e** `{Object}` 事件参数
    * **host** `{string}` 访问站点
    * **client** `{string}` 客户端 IP

#### block

代理请求屏蔽事件

* **e** `{Object}` 事件参数
    * **type** `{string}` 屏蔽理由，目前有 `host` 表示站点白名单限制 不允许访问
    * **host** `{string}` 访问站点
    * **client** `{string}` 客户端 IP
