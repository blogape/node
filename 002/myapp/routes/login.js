const User=require('../models/user');


exports.form=(req,res)=>{
    res.render('login',{title:'Login'})
}


exports.submit=(req,res,next)=>{
    const data=req.body.user;
    User.authenticate(data.name,data.pass,(err,user)=>{   // 检查凭证
        if(err) return next(err);  //错误传递
        if(user) {
            req.session.uid=user.id; // 为认证存储uid
            res.redirect('/')  //重定向到记录列表
        }else{
            res.error('sorry invalid credentials');//输出错误信息
            res.redirect('back');//重定向回登录表单
        }
    })
}


exports.logout=(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    })
}