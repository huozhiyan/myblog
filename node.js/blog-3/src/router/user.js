// 导入用户登录内容
const { login } = require('../controller/user')
// 导入成功和失败的模板
const { SuccessModel, ErrorModel } = require('../model/resModel')

// user 路由
const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // 传入两个参数 用户名 密码
        const result = login(username, password)

        return result.then(data => {
            if (data.username) {
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        }) 
    }

    // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.cookie.username) {
            return Promise.resolve(new SuccessModel())
        } else {
            return Promise.resolve(new ErrorModel('尚未登录'))
        }
    }
}

// 导出共享
module.exports = handleUserRouter