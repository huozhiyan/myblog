// 获取 node.js 提供的原生 http 模块
const http = require('http')
const querystring = require('querystring')

// 创建服务
const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[1]
    const query = querystring.parse(url.split('?')[1])

    // 设置返回格式为 JSON
    res.setHeader('Content-type', 'application/json')

    // 返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }
    // 返回
    if (method === 'GET') {
        res.end(
            JSON.stringify(resData)
        )
    }
    if (method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            resData.postData = postData
            // 返回
            res.end(
                JSON.stringify(resData)
            )
        })
    }
})

// 监听端口
server.listen(8000)
console.log('OK')