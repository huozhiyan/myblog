// 获取环境参数，process 为 node.js 进程的一些信息
const env = process.env.NODE_ENV

// 配置
let MYSQL_CONF
let REDIS_CONF

// 开发环境下
if (env === 'dev') {
    // mysql 配置
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '1234abcd',
        port: '3306',
        database: 'myblog'
    }

    // redis 配置
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

// 线上环境下
if (env === 'production') {
    // mysql 配置
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '1234abcd',
        port: '3306',
        database: 'myblog'
    }

    // redis 配置
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

// 导出共享
module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}