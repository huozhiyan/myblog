const http = require('http')

// 创建服务
const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'})
    res.end('<h1>hello world</h1>')
})

// 监听服务
server.listen(3000, () => {
    console.log('listening on 3000 port')
})
