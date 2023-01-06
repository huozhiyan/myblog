// const {
//     reject
// } = require('lodash')
const redis = require('redis')
const {
    REDIS_CONF
} = require('../conf/db.js')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

// 
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    // 是对象的话转为 JSON 字符串的格式
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            // 出错
            if (err) {
                reject(err)
                return
            }
            // val 为 null，给它返回 null
            if (val == null) {
                resolve(null)
                return
            }
            try {
                // 先尝试作为对象返回
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                // 上面不成功的话直接返回
                resolve(val)
            }
        })
    })
    return promise
}

// // 连接数据库，启动之后立即执行
// (async function () {
//     await redisClient.connect()
//         .then(() => console.log('redis connect success!'))
//         .catch(console.error)
// })

// // set
// async function set(key, val) {
//     // 临时变量的形式
//     let objVal
//     // 如果 val 是对象类型，则转为字符串
//     if (typeof val === 'object') {
//         objVal = JSON.stringify(val)
//     } else {
//         objVal = val
//     }

//     // 设置 key value
//     await redisClient.set(key, objVal)
// }
// // get
// async function get(key) {
//     try {
//         let val = await redisClient.get(key)

//         if (val == null) return val

//         try {
//             val = JSON.parse(val) // 尝试转换为 JS 对象
//         } catch (err) {}

//         return val

//     } catch (err) {
//         throw err
//     }
// }

module.exports = {
    set,
    get
}