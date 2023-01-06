const { exec } = require('../db/mysql')
// 登录（通过用户名和密码）
const login = (username, password) => {
    const sql = `
    select username, realname from users where username='${username}' and password='${password}'
    `
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

// 导出共享
module.exports = {
    login
}