const sqlite3=require('sqlite3').verbose();
const dbName='later.sqlite';
const db=new sqlite3.Database(dbName);// 链接到一个数据库文件

db.serialize(()=>{
    const sql=`
        CREATE TABLE IF NOT EXTSTS articles
        (id integer primary key,title,content TEXT)
    `;                 //如果还没有，创建一个'articles'表
    db.run(sql);  
})

class Articles{
    static all(cb){
        db.all('SELECT*FROM articles',cb);//获取所有文章
    }
    static find(id,cb){
        db.get('SELECT*FROM articles WHERE id =?',id,cb); // 获取一遍指定的文章
    }
    static create(data,cb){
        const sql='INSERT INTO articles(title,content) VALUES(?,?)';//问好表示参数
        db.run(sql,data.title,data.content,cb);
    }
    static delete(id,cb){
        if(!id) return cb(new Error('please provide an id'));
        db.run('DELETE FROM articles WHERE id=?',id,cb);
    }

}


module.exports=db;
module.exports.Articles=Articles;