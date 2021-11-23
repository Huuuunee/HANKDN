const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();
const mysql = require('mysql2');
const crypto = require('crypto')
const saltRounds = 10;
const db_info = {
    host: 'defalut.cmj5m2fzc8ae.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'injoo123',
    database: 'mydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}
const pool = mysql.createPool(db_info);


passport.serializeUser((user, done) => { // done 세션에게 데이터값을 지정 
    console.log('serializeUser() 호출됨.');
    console.log('JSON : ',JSON.stringify(user));

    done(null, JSON.stringify(user))
});

passport.deserializeUser((user, done) => { // 세션에 지정된값을 호출해서 있는지 여부
    console.log('deserializeUser() 호출됨.');
    console.log('hi : ',JSON.stringify(user));

    done(null, JSON.stringify(user));
})

passport.use('local', new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'password',
    passReqToCallback: true,
    session: true // 세션에 저장 여부
}, (req, userId, password, done) => {
    console.log('passport의 local-login : ', userId, password)
    pool.getConnection((err, conn) => {
        conn.query('SELECT id, password FROM user WHERE id = ?', userId, (err, result, fields) => {
            console.log(result);
            if(userId != result[0].id || password != result[0].password) {
                console.log('비밀번호 불일치!')
                return done(null, false, req.flash('loginMessage', '비밀번호 불일치!'))
            }
        
            console.log('비밀번호 일치!')
            return done(null, {
                userId : userId,
                password: password
            })
        })
        conn.release();
    });

}))



module.exports = passport