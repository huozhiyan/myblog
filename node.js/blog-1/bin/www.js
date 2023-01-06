// 引入 http 内置模块
const http = require('http')

// 端口
const PORT = 8000
// 引入 app.js
const serverHandle = require('../app')
// 创建服务
const server = http.createServer(serverHandle)
// 监听端口
server.listen(PORT)