const express = require('express')
const router = express.Router()
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



// 게시판 업로드
router.post('/upload', (req, res) => {
    console.log(req.body);
    // const id = req.body.id;
    const userId = req.body.userId;
    const picture = req.body.picture
    const tag = req.body.tag;
    const content = req.body.content;
    let today = new Date();   
    const postDate = today;
    
    console.log(today);
    pool.getConnection((err, conn) => {
        conn.query('INSERT INTO sns(user_ID, picture, tag, content, postDate) VALUES(?, ?, ?, ?, ?)', [userId, picture, tag, content, postDate], (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('postInsertError');
            }
            else {
                console.log('여기1', userId);
                console.log('여기2', picture);
                console.log('여기3', tag);
                console.log('여기4', content);
                console.log('여기5', postDate);
                console.log('upload 추가 결과 :',result);
                res.send('postInsertSuccess');
            }
        })
        conn.release();
    })

})
// 게시판 조회 (게시판 id 받아오는거 GET 으로 가능)
router.get('/list/:page', (req, res) => {
    const page = req.params.page;
    console.log(page);
    pool.getConnection((err, conn) => {
        conn.query('SELECT id, user_ID, picture, tag, content, postDate FROM sns ORDER BY RAND() LIMIT 30', (err, result, fields) => {
            if(err) {
                console.log('조회에러', err);
                res.send('listNotFound');
            }
            else {
                console.log(result);
                res.send(result);
            }
    
        })
        conn.release();
    })


})
// 게시판 수정 할때 데이터 조회
router.post('/pageOneList', (req, res) => {
    const pageId = req.body.id;
    console.log(pageId);
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM sns WHERE id = ?', pageId, (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('fail');
            }
            else {
                console.log(result);
                res.send(result);
            }
        })
        conn.release();
    })
})

// 게시판 수정하기
router.post('/pageUpdate', (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const userId = req.body.userId;
    const picture = req.body.picture
    const tag = req.body.tag;
    const content = req.body.content;
    let today = new Date();   
    const postDate = today;
    
    console.log(today);
    pool.getConnection((err, conn) => {
        conn.query('UPDATE sns SET userId = ?, picture = ?, tag = ?, content = ?, postDate = ? WHERE id = ?', [userId, picture, tag, content, postDate], (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('pageUploadFail');
            }
            else {
                console.log(result);
                res.send('UpdateSuccess')
            }
        })
    })

})

//게시글 삭제
router.post('/pageDelete', (req, res) => {
    const id = req.body.id;
    console.log(id);
    pool.getConnection((err, conn) => {
        conn.query('DELETE FROM sns WHERE id = ?', id, (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('DeleteFail');
            }
            else {
                console.log(result);
                res.send('DeleteSuccess');
            }
        })
    })
})

module.exports = router;