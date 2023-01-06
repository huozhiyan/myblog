// 导入用户登录内容
const { login } = require('../controller/user')
// 导入成功和失败的模板
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString is ', d.toGMTString())
    return d.toGMTString()
}

// user 路由
const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // const { username, password } = req.query
        // 传入两个参数 用户名 密码
        const result = login(username, password)

        return result.then(data => {
            if (data.username) {
                // 操作 cookie；path=/：保证所有路径都能用；httpOnly：只允许后端来改；expires：设置过期时间
                // res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname
                // session 同步到 redis
                set(req.sessionId, req.session)

                console.log('req.session is', req.session)

                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        }) 
    }

    // // 登录验证的测试
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录')) 
    // }
}

// 导出共享
module.exports = handleUserRouter