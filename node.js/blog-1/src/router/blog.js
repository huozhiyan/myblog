// 导入博客和用户控制器相关内容
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog') 
// 导入成功和失败的模型
const { SuccessModel, ErrorModel } = require('../model/resModel')

// blog 相关路由
const handleBlogRouter = (req, res) => {
    const method = req.method // GET/POST
    const id = req.query.id // 获取 id

    // 获取博客列表 GET 请求
    if (method === 'GET' && req.path === '/api/blog/list') {
        // 博客的作者，req.query 用在 GET 请求中
        const author = req.query.author || ''
        // 博客的关键字
        const keyword = req.query.keyword || ''
        // 查询的结果
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情 GET 请求
    if (method === 'GET' && req.path === '/api/blog/detail') {
        // 获取博客详情数据
        const result = getDetail(id)
        // 创建并返回成功模型的 promise 实例对象
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 新建一篇博客 POST 请求
    if (method === 'POST' && req.path === '/api/blog/new') {
        // 假数据，待开发登录时再改成真实数据
        req.body.author = 'zhangsan'
        // req.body 用于获取请求中的数据（用在 POST 请求中）
        const result = newBlog(req.body)
        // 创建并返回成功模型的 promise 实例对象
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        // 传递两个参数 id 和 req.body
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新博客失败')
            }
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        // 假数据，待开发登录时再改成真实数据
        const author = 'zhangsan' 
        const result = delBlog(id, author)
        
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败')
            }
        })
    }
}

// 导出
module.exports = handleBlogRouter