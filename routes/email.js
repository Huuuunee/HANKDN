const express = require('express');
const app = express();
const db_config = require('../config/database')
const conn = db_config.init();
db_config.connect(conn);

app.use (express.json());
app.use(express.urlencoded({extended: true}))


app.get('/login',(req,res)=>{
    res.send("하이")
    
    //let [one,two,three,four,five] =  [a.slice(d,d+1)]
});

app.post('/login',(req,res)=>{
    res.send("하이")
    console.log(req.body)
    const menunum = req.body.menunum;
    console.log(menunum);
//    let [one,two,three,four,five] =  [a.slice(d,d+1),a.slice(d+1,d+2),a.slice(d+2,d+3),a.slice(d+3,d+4),a.slice(d+4,d+5),a.slice(d+5,d+6)]
// id 값이 json이라서 오류남 string 으로 바꿔줘야함
    let arr = menunum.toString().split('')
    console.log(arr);
    //let [one,two,three,four,five] = arr.map((i) => {i})
    //console.log(one,two,three,four,five);

});

module.exports = app