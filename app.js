var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');
var ProjectParticipation = require('./routes/project_participations');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());  // 用于解析json格式的post请求
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//解析 token 的中间件
const expressJWT = require('express-jwt');
app.use(expressJWT({secret:'zzz'}).unless({path: [/^\/users\//,/^\/projects\//,/^\/project_participations\//]}));

// 路由
app.use('/', indexRouter);  // 默认访问indexRouter
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/project_participations', ProjectParticipation);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({
      message: 'invalid token'
    });
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
