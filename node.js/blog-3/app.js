// node.js 提供的原生模块 便于处理 url 
const querystring = require('node:querystring')
// 博客相关路由
const handleBlogRouter = require('./src/router/blog')
// 用户登录相关路由
const handleUserRouter = require('./src/router/user')

// 用于处理 POST 请求的数据
const getPostData = (req) => {
    // 创建 promise 实例
    const promise = new Promise((resolve, reject) => {
        // 不是 post 请求 直接返回
        if (req.method !== 'POST') {
            // 不是 POST 请求 直接返回空
            resolve({})
            return
        }
        // 请求头不是 application/json 格式 直接返回
        if (req.headers['content-type'] !== 'application/json') {
            // 不是 JSON 格式 直接返回空
            resolve({})
            return
        }
        // 初始化 postData
        let postData = ''
        // 每次发送的数据 记录在 postData 中
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        // 数据发送完成 转义 JSON 为对象
        req.on('end', () => {
            // 
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    // 返回实例对象
    return promise
}

// 处理服务
const serverHandle = (req, res) => {
    // 设置响应头的格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取 path 即获取请求地址
    const url = req.url
    // 截取前部分的地址 ? 前面的部分
    req.path = url.split('?')[0] // 获取 ? 的前半部分

    // 解析 query，截取后半部分的地址 ? 后面的部分，也是要查询的地址
    req.query = querystring.parse(url.split('?')[1])

    // 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2;k3=v3
    // 先以 ; 分割
    cookieStr.split(';').forEach((item => {
        if(!item) {
            return
        }
        // 再以 = 分割
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    }))

    // 处理 post data
    getPostData(req).then(postData => {
        // 解析 POST 请求中的数据
        req.body = postData

        // 处理 blog 路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        // 处理 user 路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }
        // 未命中路由，返回 404
        res.writeHead(404, {
            "Content-type": "text/plain"
        })
        // 在浏览器显示的内容
        res.write("404 Not Found\n")
        // 结束服务端和客户端的连接
        res.end()
    })

}
// 模块化 把 serverHandle 暴露出去
module.exports = serverHandle