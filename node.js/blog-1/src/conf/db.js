// 获取环境参数，process 为 node.js 进程的一些信息
const env = process.env.NODE_ENV

// 配置
let MYSQL_CONF

// 开发环境下
if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '1234abcd',
        port: '3306',
        database: 'myblog'
    }
}

// 线上环境下
if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '1234abcd',
        port: '3306',
        database: 'myblog'
    }
}

// 导出共享
module.exports = {
    MYSQL_CONF
}