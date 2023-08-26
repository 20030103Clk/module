const {execSQL} = require('../db/mysql');
const { SuccessModel,ErrorModel } = require("../model/responseModel");

const ProjectParticipation = {};

//查询项目接口
ProjectParticipation.list = (req,res) => {
    const project_id = req.query.project_id;
    if(/^\d+$/.test(project_id)){
        let sql = `select * from interface where project_id = ${project_id}`;
        execSQL(sql).then(result => {
        if(result.length){
            res.send(result);
        }
        })
    }else{
        res.send(new ErrorModel('请输入正确的id'));
    }
}

//查询项目成员
ProjectParticipation.member =  (req,res) => {
    const project_id = req.query.project_id;
    let sql = `select * from project_participation where project_id = ${project_id}`;
    execSQL(sql).then(async partResult => {
        console.log('partResult',partResult);
        if(partResult.length){
            const result = await Promise.all(partResult.map(async item => {
                const sql = `select * from user where user_id = ${item.user_id}`;
                const data = await execSQL(sql);
                return {
                    user_id: item.user_id,
                    user_name: data[0].user_name,
                    role_id: item.role_id,
                }
            }))
            res.send(new SuccessModel(result,'查询成功'));
            
        }else{
            res.send(new ErrorModel('查询失败'));
        }
    })
}

//添加项目成员
ProjectParticipation.add = (project_id,user_id,role_id) => {
    let sql = `insert into project_participation (project_id,user_id,role_id) values ('${project_id}','${user_id}','${role_id}')`;
    return execSQL(sql);
}

module.exports = {
    ProjectParticipation
}