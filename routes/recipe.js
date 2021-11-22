const express = require('express')
const router = express.Router()
const mysql = require('mysql2');
const multer = require('multer');
const parh = require('path');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})
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

router.get('/picture/:imageName', (req, res) => {
    res.sendFile('C:/Users/Jeon/OneDrive/Desktop/ALL/코딩/passport/images/' + req.params.imageName)
})

router.post('/picture', upload.single('image'), (req, res) => {
    res.send('Succedss');
})

module.exports = router;
