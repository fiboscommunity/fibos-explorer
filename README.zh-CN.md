[English](./README.md) | 简体中文

区块链浏览器

## 项目说明

本项目基于 react + react-router + antd 开发的前端项目，在使用之前请保证已安装好 `npm` 和 `node` 。

本项目部分功能依赖于浏览器插件，请确保安装了正确的插件。

## 配置

本项目为区块链项目，相关配置信息存放在 `public/config/config.json` 和 `package.json` 文件中，下面对于配置项进行逐一说明：

| 字段名          | 作用                                                         |
| --------------- | ------------------------------------------------------------ |
| client.chainId  | 链 Id                                                        |
| client.hostname | 链 rpc 服务地址                                              |
| client.port     | 链 rpc 服务端口                                              |
| client.protocol | 链 rpc 服务网络协议，一般为 http 或 https                    |
| client.blockchain | 链名称，重要！需要与插件内该链的链名称一致                    |
| client.searchApi | 用于代替 history 服务的查询接口地址                    |
| openAccount     | 是否打开 `账号` 菜单项，提供创建账号和领取空投奖励两个功能   |
| checkAccount    | 用于确定 cpu 抵押价格和网络抵押价格的账号，请确保账号一定在链已经创建，不可使用特殊账号，例如 `eosio` |

package.json

| param    | Effect    |
| --------------- | ------------------------------------------------------------ |
| CHAIN_PROXY_ADDRESS     | proxy 服务地址 |

特别说明： rpc 节点服务需要一个开启 history 的全节点

## 安装

`npm install`

## 开发

`npm start`

### 代理

代理配置在 `package.json` 文件中，修改 `proxy` 配置内容即可。

## 打包

`npm run build`

打包后的文件存放在 `build` 文件夹中
