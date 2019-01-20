const express=require('express');
const app=express();
const articles=[{title:'Example'}];
app.set('port',process.env.PORT||3000)
app.get('/articles',(req,res,next)=>{ // 获取所有文章
    res.send('hello world')
});
app.post('/artcles',(req,res,next)=>{ //创建一遍文章
    res.send('Ok')
})
app.get('/articles/:id',(req,res,next)=>{ // 获取指定文章
    const id=req.params.id;
    console.log('Fetching:',id);
    res.send(articles[id]);
})
app.delete('/articles/:id',(req,res,next)=>{    // 删除指定文章
  const id=req.params.id;
  console.log('Deleting:',id);
  delete articles[id];
  res.send({message:'Deleted'});
})
app.listen(app.get('port'),()=>{
    console.log('express run 3000')
})

module.exports=app;