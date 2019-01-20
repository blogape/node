const redis=require('redis');
const bcrypt=require('bcrypt');
const db=redis.createClient(); //创建到redis的长连接

class User{
    constructor(obj){
        for(let key in obj){   //循环遍历传入的对象
            this[key]=obj[key]   //设定当前类的所有属性
        }
    };
    save(cb){ //保存
        if(this.id){
            this.update(cb); //如果设置了ID 则用户已经存在
        }else{
            db.incr('user:ids',(err,id)=>{ //创建唯一ID
                if(err) return cb(err);
                this.id=id;  //设定ID以便保存
                this.hashPassword((err)=>{  //密码哈希
                    if(err) return cb(err);
                    this.update(cb); //保存用户属性
                })
            })
            
        }
       
    };
    update(cb){  //更新
            const id=this.id;
            db.set(`user:id:${this.name}`,id,(err)=>{  //用户名称索引用户Id
                    if(err) return cb(err);
                    db.hmset(`user:${id}`,this,(err)=>{  //用redis 存储当前类的属性
                        cb(err);
                    })
            })
    };
    hashPassword(cb){ //加密
        bcrypt.genSalt(12,(err,salt)=>{  //生成有12个字符的盐
            if(err) return cb(err);
            this.salt=salt; //设定盐以便保存
            bcrypt.hash(this.pass,salt,(err,hash)=>{  //生成hash
                if(err) return cb(err);
                this.pass=hash;   //设定hash 以便保存
                cb();
            })
        })

    };
    static getByName(name,cb){
        User.getId(name,(err,id)=>{   //根据名称查询用户Id
            if(err) return cb(err);
            User.get(id,cb); //用id 抓取用户
        })
    };
    static getId(name,cb){
        db.get(`user:id:${name}`,cb); //取得由名称索引的id
    };

    static get(id,cb){
        db.hgetall(`user:${id}`,(err,user)=>{  // 获取普通对象哈希
                if(err) return cb(err);
                cb(null,new User(user)) //将普通对象转换成新的User对象
        })
    };

    // 用户密和密码认证
    static authenticate(name,pass,cb){
        User.getByName(name,(err,user)=>{  //通过用户名查找用户
            if(err) return cb(err);
            if(!user.id) return cb();   //用户不存在
            bcrypt.hash(pass,user.salt,(err,hash)=>{    //对给出的密码做hash处理
                if(err) return cb(err);
                if(hash==user.pass) return cb(null,user);//匹配发现项
                cb(); //密码无效
            })
        })
    }

}

module.exports=User;  //输出User类


//  const user=new User({
//      name:'Example',pass:'test'
//  }) //创建新用户
 
//  user.save((err)=>{    //保存用户
//      if(err) console.error(err);
//      console.log('user id %d',user.id);
//  })