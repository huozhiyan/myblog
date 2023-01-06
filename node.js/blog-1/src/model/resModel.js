// 基础模型
class BaseModel {
    // data 是对象类型 message 是字符串类型
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}
// 成功模型 errno 赋值 0
class SuccessModel extends BaseModel {
    constructor(data, message) {
        // 继承父类
        super(data, message)
        // 成功的值 0
        this.errno = 0
    }
}
// 失败模型 errno 赋值 -1
class ErrorModel extends BaseModel {
    constructor(data, message) {
        // 继承父类
        super(data, message)
        // 失败的值 -1
        this.errno = -1
    }
}

// 导出共享
module.exports = {
    SuccessModel,
    ErrorModel
}