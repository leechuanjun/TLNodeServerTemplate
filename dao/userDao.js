// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');
var $network_macro = require('../util/common');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: $network_macro.failure,
            result: {
              desc: '操作失败'
            }
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    login: function (req, res, next) {
      // 获取前台页面传过来的参数
        var param = req.query || req.params;

        if(param.password == null || param.telephone == null) {
            jsonWrite(res, undefined);
            return;
        }
        pool.getConnection(function(err, connection) {
            connection.query($sql.login, [param.telephone, param.password], function(err, result) {
              if(result) {
                res.json({
                    code: $network_macro.success,
                    result: {
                      desc: '登录成功'
                    }
                });
              }
              else {
                res.json({
                    code: $network_macro.failure,
                    result: {
                      desc: '登录失败'
                    }
                });
              }

              connection.release();
            });
        });
    },
    register: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            if(param.password == null || param.telephone == null) {
                jsonWrite(res, undefined);
                return;
            }
            // 建立连接，向表中插入值
            connection.query($sql.register, [param.username, param.password, param.telephone], function(err, result) {
                if(result) {
                  res.json({
                      code: $network_macro.success,
                      result: {
                        desc: '注册成功'
                      }
                  });
                }
                else {
                  res.json({
                      code: $network_macro.failure,
                      result: {
                        desc: '注册失败'
                      }
                  });
                }
                // 释放连接
                connection.release();
            });
        });
    },

    add: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;

            // 建立连接，向表中插入值
            connection.query($sql.insert, [param.username, param.password, param.telephone], function(err, result) {
                if(result) {
                    result = {
                        code: $network_macro.success,
                        result: {
                          desc: '增加成功'
                        }
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);

                // 释放连接
                connection.release();
            });
        });
    },

    delete: function (req, res, next) {
        // delete by Id
        pool.getConnection(function(err, connection) {
            var id = +req.query.id;
            connection.query($sql.delete, id, function(err, result) {
                if(result.affectedRows > 0) {
                    result = {
                        code: $network_macro.success,
                        result: {
                          desc: '删除成功'
                        }
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    update: function (req, res, next) {
        // update by id
        var param = req.body;
        if(param.username == null || param.password == null || param.telephone == null || param.id == null) {
            jsonWrite(res, undefined);
            return;
        }

        pool.getConnection(function(err, connection) {
            connection.query($sql.update, [param.username, param.password, param.telephone, param.id], function(err, result) {
                // 使用页面进行跳转提示
                if(result.affectedRows > 0) {
                    res.render('success', {
                        result: result
                    }); // 第二个参数可以直接在jade中使用
                } else {
                    res.render('failure',  {
                        result: result
                    });
                }
                console.log(result);

                connection.release();
            });
        });

    },

    queryById: function (req, res, next) {
        var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryById, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }

};
