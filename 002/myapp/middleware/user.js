const User=require('../models/user');

module.exports=(req,res,next)=>{
    const uid=req.session.uid;  //从会话中取出已登录用户的id
    if(!uid) return next(); 
    User.get(uid,(err,user)=>{   // 从redis中取出已登录用户的数据
        if(err) return next(err);
        req.user=res.locals.user=use; //将用户数据输出到响应的对象中
        next(); 
    })

}