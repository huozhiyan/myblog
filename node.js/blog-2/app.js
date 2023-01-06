// node.js 提供的原生模块 便于处理 url 
const querystring = require('node:querystring')
// 引入 get set
const { get, set } = require('./src/db/redis')
// 博客相关路由
const handleBlogRouter = require('./src/router/blog')
// 用户登录相关路由
const handleUserRouter = require('./src/router/user')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString is ', d.toGMTString())
    return d.toGMTString()
}

// session 数据
// const SESSION_DATA = {}

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
    // 截取前半部分的地址 ? 前面的部分
    req.path = url.split('?')[0] // 获取 ? 的前半部分

    // 解析 query，截取后半部分的地址 ? 后面的部分，也是要查询的地址
    req.query = querystring.parse(url.split('?')[1])

    // 解析 cookie
    req.cookie = {}
    // 获取 cookie
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2;k3=v3
    // 以 ; 做分割再遍历
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        // 再以 = 做分割
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    // 解析 session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    // 没有 userId 则需要 cookie
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值为一个空对象
        set(userId, {})
    }

    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session 为空对象
            req.session = {}
        } else {
            // session 不为空，直接赋值
            req.session = sessionData
        }
        console.log('req.session', req.session)

        // 处理 post data
        return getPostData(req)
    })
    .then(postData => {
        // 解析 POST 请求中的数据
        req.body = postData

        // 处理 blog 路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                // 如果需要设置 cookie
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
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
                // 如果需要设置 cookie
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
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