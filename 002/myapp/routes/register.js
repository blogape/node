const User=require('../models/user');


exports.submit=(req,res,next)=>{
    const data=req.body.user;
    User.getByName(data.name,(err,user)=>{  //检查和用户名是否唯一
        if(err) return next(err); //延迟传递数据库连接错误和其他错误
        // redis will default it
        if(user.id){
            res.error('Username already token');// 用户名已被占用
            res.redirect('black');
        }else{
            user=new User({
                name:data.name,
                pass:data.pass
            });
            user.save((err)=>{
                if(err) return next(err);
                req.session.uid=user.id;

            })
        }
    })
}

exports.from = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
}