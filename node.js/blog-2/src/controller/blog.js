// 导入执行 sql 的相关内容
const { exec } = require('../db/mysql')

// 获取博客列表（通过作者和关键字）
const getList = (author, keyword) => {
    // 1=1 是为了语法的绝对正确，注意以下 sql 拼接时的空格
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    // 以时间的倒序
    sql += `order by createtime desc;`

    // 返回 promise
    return exec(sql)
}

// 获取博客详情（通过 id）
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        // 返回数组的对象
        return rows[0]
    })
}

// 新建博客 newBlog 若没有，就给它一个空对象
const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content author 属性
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createTime = Date.now()

    const sql = `
                insert into blogs (title, content, createtime, author)
                values ('${title}', '${content}', '${createTime}', '${author}');
    `

    return exec(sql).then(insertData => {
        console.log('insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

// 更新博客（通过 id 更新）
const updateBlog = (id, blogData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象 包含 title content 属性
    const title = blogData.title
    const content = blogData.content

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `
    return exec(sql).then(updateData => {
        // console.log('updateData is ', updateData)
        // 更新的影响行数大于 0，则返回 true
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

// 删除博客（通过 id 删除）
const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

// 导出共享
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}