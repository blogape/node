

function parseFied(field){  // 解析 entry[name] 字符
    return field
    .split(/\[|\]/)
    .filter((s)=>s)
}

function getField(req,field){ //基于parseField()的结果查找属性
    let val=req.body;
    field.forEach((prop)=>{
        val=val[prop]
    });
    return val;
}

exports.required=(field)=>{
    field=parseFied(field); //解析输入域一次
    return (req,res,next)=>{
        if(getField(req,field)){   //每次收到请求都检查输入域是否有值
            next()    //如果有 则进入下一个中间件
        }else{
            console.error(`${field.join(' ')} is required`); //如果没有显示错误
            res.redirect('back');
        }
    }
}

exports.lengthAbove=(field,len)=>{
    field=parseFied(field);
    return (req,res,next)=>{
        if(getField(req,field).length>len){ 
            next();
        }else{
            const fields=field.join(' ');
            console.error(`${fields} must have more than ${len} characters`);
            res.redirect('back')
        }
    }
}