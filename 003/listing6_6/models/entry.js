const redis = require('redis');
const db = redis.createClient(); // 创建客户端实例

class Entry {
    static getRange(from, to, cb) {
        // 用来获取消息记录的 redis lrange 函数
        db.lrange('entries', from, to, (err, items) => {
            if (err) return cb(err);
            let entries = [];
            items.forEach((item) => {
                entries.push(JSON.parse(item)); // 解码之前保存为JSON的消息记录
            });
            cb(null, entries);
        })
    }



    constructor(obj) {
        for (let key in obj) { //循环遍历传入对象中的键
            this[key] = obj[key]; //合并值
        }
    }
    save(cb) {
        const entryJson = JSON.stringify(this); //将保存的消息转换成JSON字符串
        db.lpush( //将JSON字符串保存到redis列表中
            'entries',
            entryJson,
            (err) => {
                if (err) return cb(err);
                cb();
            }
        )
    }
}


module.exports = Entry;