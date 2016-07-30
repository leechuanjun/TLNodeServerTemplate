var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('updateUser');
});


// 增加用户
//TODO 同时支持get,post
router.get('/addUser', function(req, res, next) {
    console.log('新增账号');
    userDao.add(req, res, next);
});


router.get('/queryAll', function(req, res, next) {
    console.log('查询所有账号');
    userDao.queryAll(req, res, next);
});

router.get('/query', function(req, res, next) {
    console.log('查询指定id的账号');
    userDao.queryById(req, res, next);
});

router.get('/deleteUser', function(req, res, next) {
    console.log('删除账号');
    userDao.delete(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
    console.log('更新账号');
    userDao.update(req, res, next);
});

module.exports = router;
