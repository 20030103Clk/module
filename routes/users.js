var express = require('express');
var router = express.Router();
const {execSQL} = require('../db/mysql');

const {userHandler} = require('../controllers/user') 
const { SuccessModel,ErrorModel } = require("../model/responseModel");

// JWT 1:引入
const jwt = require('jsonwebtoken') //用来生成token

// JWT 2：定义secret密钥
const secretKey = 'zzz'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users page default');
});

// 注册
router.post('/register',function(req,res,next){
    // 如果存在用户名，就不允许注册
    let sql = `select * from user where user_name = '${req.body.username}'`;
    execSQL(sql).then(data=>{
        if (data.length>0){
            res.send(new ErrorModel('用户名已存在'));
        }
        else{
            userHandler.register(req.body.username,req.body.password).then(()=>{
              res.send(new SuccessModel('注册成功！'))
            })
        }
    })
  
})


// 登录
router.post('/login',(req,res)=>{
    // 1.获取用户名和密码
    console.log(req.body);
    const {username,password} = req.body;
    console.log(username,password);
    // 2.查询数据库
    userHandler.login(username,password).then(loginData=>{
        if (loginData.length>0){
            // JWT 3：生成token
            const token = jwt.sign(
                {username:username}, //payload
                secretKey, //密钥
                {expiresIn:60*60*24} //过期时间
            )
            res.send(new SuccessModel({token:token},'login success'));
        }else{
            res.send(new ErrorModel('账号或密码错误'));
        }
    })

  
})

//查询用户参与项目
router.get('/list',(req,res)=>{
    const {user_id} = req.query;
    let sql = `select * from project_participation where user_id = ${user_id}`;
    execSQL(sql).then(data=>{
        const {project_id}= data[0];
        userHandler.list(project_id).then(listdata=>{
            res.send(new SuccessModel(listdata,'查询成功'));
        })
    })
})

module.exports = router;
