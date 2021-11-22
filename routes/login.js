const express = require('express')
const router = express.Router()
const passport = require('../controller/passport')
require('passport')
const mysql = require('mysql2');
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

 
// 기본 페이지
router.get('/', (req, res) => {
    res.render('index.ejs');
    console.log('get여기', req.session.passport);
})

// 로그인
router.post('/', passport.authenticate('local', {
    failureRedirect : '/loginFail', 
    failureFlash : true,
}), (req, res, next) => {
    req.session.save((err) => {
        next(err);
    })
    console.log('post여기', req.session);
    res.redirect('/loginSuccess');
})

// 로그인 성공 할시
router.get('/loginSuccess', (req, res) => {
    res.send('hi');  
})

// 로그인 실패할시
router.get('/loginFail', (req, res) => {
    res.send('hi2');
})
 
// 회원가입
router.post('/signup', (req, res) => {
    console.log(req.body);
    let userId = req.body.userId;
    let password = req.body.password;
    let email = req.body.email;
    let nickname = req.body.nickname;
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM user WHERE id = ?', userId,(err, result, fields) => {
            if(err) throw err;
            try {
                if(result[0] === undefined) {
                    console.log('여기 result',result[0]);
                    conn.query('insert into user (id, password, nickname, email) values (?,?,?,?)', [userId, password, nickname, email], (err, result, fields) => {
                        if(err) {
                            console.log(err);
                            res.send('fafa1')
                        }
                        else {
                            console.log(result)
                            res.send('suce')
                        }
                    });
                    conn.release();
                } else {
                    res.send('fafa2')
                }
            } catch {
                res.send('fafa3')
            }
        })
        conn.release();
    });
})

// 아이디 중복체크
router.post('/idOverlap', (req, res) => {
    const id = req.body.userId;
    pool.getConnection((err, conn) => {
        conn.query('SELECT id FROM user WHERE id = ?', id, (err, result, fields) => {
            console.log('시발 아디 오버랩', result);
            if(result[0] == undefined) {
                res.send('idsucc');
            }
            else {
                res.send('idfail')
            }
        })
        conn.release();
    });
})


// 이메일 중복 체크
router.post('/emailOverlap', (req, res) => {
    const email = req.body.email;
    console.log('hi : ',email);
    pool.getConnection((err, conn) => {
        conn.query('SELECT email FROM user WHERE email = ?', email, (err, result, fields) => {
            console.log('시발 이메일 오버랩', result);
            if(result[0] == undefined) {
                console.log('중복없음');
                res.send('emailsucc')
            }
            else {
                console.log('중복있음')
                res.send('emailfail')
            }
        })
        conn.release();
    });
})

// 프로필 이름 가져오기 
router.post('/getNickname', (req, res) => {
    const userId = req.body.userId;
    pool.getConnection((err, conn) => {
        conn.query('SELECT nickname FROM user WHERE id = ?', userId, (err, result, fields) => {
            if(err){
                res.send('getfafa1');
            }
            else {
                console.log(result[0].nickname);
                let getNickname = result[0].nickname;
                res.send(getNickname);
            }
        })
        conn.release();
    });
})

router.post('/nameChange', (req, res) => {
    const userId = req.body.userId;
    const nickname = req.body.nickname;
    console.log(userId);
    console.log(nickname);
    pool.getConnection((err, conn) => {
        conn.query('UPDATE user SET nickname = ? WHERE id = ?', [nickname, userId], (err, result, fields) => {
            if(err) {
                res.send('fail');
            } else {
                console.log(result);
                res.send('changeSuccess');
            }
        })
        conn.release();
    });
})

router.post('/isTasteDiv', (req, res) => {
    const userId = req.body.userId;
    const local = req.body.local;
    const health = req.body.health;
    let num = '1'
    console.log('음식', userId);
    console.log('음식', local);
    console.log('음식', health);
    if(local == 'on' && health == 'on') {
        let num = '3';
        pool.getConnection((err, conn) => {
            conn.query('UPDATE user SET taste_div = ? WHERE id = ?', [num1, userId], (err, result, fields) => {
                res.send('3변경')
            });
            conn.release();
        });
    } else if(local == 'on' && health == 'off') {
        let num1 = '2';
        pool.getConnection((err, conn) => {
            conn.query('UPDATE user SET taste_div = ? WHERE id = ?', [num1, userId], (err, result, fields) => {
                res.send('2변경')
            });
            conn.release();
        });
    } else if(local == 'off' && health == 'on') {
        let num2 = '1';
        pool.getConnection((err, conn) => {
            conn.query('UPDATE user SET taste_div = ? WHERE id = ?', [num2, userId], (err, result, fields) => {
                res.send('1변경')
            });
            conn.release();
        });
    }
    
})



module.exports = router