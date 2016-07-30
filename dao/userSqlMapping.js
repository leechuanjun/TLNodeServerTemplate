// dao/userSqlMapping.js
// CRUD SQL语句
var user = {
    insert:'insert into account(userName, passWord, telephone) values(?,?,?)',
    update:'update account set userName=?, passWord=?, telephone=? where id=?',
    delete: 'delete from account where id=?',
    queryById: 'select * from account where id=?',
    queryAll: 'select * from account'
};

module.exports = user;
