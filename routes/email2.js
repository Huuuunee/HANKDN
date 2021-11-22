const express = require('express');
const router = express.Router()
const { smtpTransport } =  require('../config/email');
const mysql = require('mysql2');
const { route } = require('./login');
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

pool.getConnection((err, conn) => {
    
})

var generateRandom = (min, max) => {
    var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
}

var number = '';


// 비밀번호 찾기 [ 이메일 인증 ] ( 1 )
router.post('/emailAuth', (req,res)=>{
    const userId = req.body.userId;
    console.log(userId);
    pool.getConnection((err, conn) => {
        conn.query('SELECT id FROM user WHERE id = ?', userId, (err, result, fields) => {
            console.log(result[0]);
            if(result[0] === undefined) {
                res.send('searchingFail');
            }
            else {
                pool.getConnection((err, conn) => {
                    conn.query('SELECT email FROM user WHERE id = ?', userId,  (err, result, fields) => {
                        console.log(result[0].email);
                        let userEmail = result[0].email;
                        var number = generateRandom(1111, 9999);
                        console.log(number);
                        const mailOptions = {
                            from: 'jswa7308@naver.com',
                            to: userEmail,
                            subject: '[오늘의 메뉴]인증 관련 이메일 입니다.',
                            text: '오른쪽 숫자 4자리를 입력해주세요 : ' + number
                        };
                        smtpTransport.sendMail(mailOptions, (err, info) => {
                            if(err) {
                                console.log(err);
                            }
                            console.log('finish', + info.response)
                            res.status(200).send((number).toString());
                            smtpTransport.close();
                        })
                    });
                    conn.release();
                })
            }
        })
        conn.release();
    })
    // setTimeout(() => {
    //     conn.close();
    // }, 1000)
})

// 비밀번호 찾기 ( 2 )
router.post('/pwChange', (req, res) => {
    const userId = req.body.userId;
    const password = req.body.password
    pool.getConnection((err, conn) => {
        conn.query('UPDATE user SET password = ? WHERE id = ?', [password, userId], (err, result, fields) => {
            if(err) {
                console.log('faf222');
                throw err;
            }
            console.log(result);
            console.log('잘 됨')
            res.send('변경됨');
        })
        conn.release();
    })

})
module.exports = router