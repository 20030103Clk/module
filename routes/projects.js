var express = require('express');
var router = express.Router();
const {execSQL} = require('../db/mysql');

const { projectHandler } = require('../controllers/project');
const { SuccessModel,ErrorModel } = require("../model/responseModel");

const jwt = require('jsonwebtoken');
const number = require('@hapi/joi/lib/types/number');


//查询项目列表
router.get('/list',projectHandler.list);

// 创建项目
router.post('/create',(req,res)=>{
    const {Name,description} = req.body;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const dateString = `${year}.${month}.${day} ${hours}:${minutes}`;
    const created_at = dateString;
    let token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'zzz');
    const user = decodedToken.username;
    let sql = `select user_id from user where user_name='${user}'`;
    execSQL(sql).then(data=>{
        const creator_id = data[0].user_id;
        projectHandler.create(Name,description,creator_id,created_at).then(()=>{
            res.send(new SuccessModel('创建成功'))
        });
    })
});

// 删除项目
router.post('/delete',(req,res)=>{
    let project_id = req.body.project_id;
    if(/^\d+$/.test(project_id)){
        let sql = `delete from project_participation where project_id=${project_id}`;
        execSQL(sql).then(()=>{
            projectHandler.delete(project_id).then(()=>{
                res.send(new SuccessModel('删除成功'))
            })
        })
    }else{
        res.send(new ErrorModel('请填写正确的数值'))
    }
});
module.exports = router;