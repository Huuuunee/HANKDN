const express = require('express')
const router = express.Router()
const mysql = require('mysql2');
const multer = require('multer');
const parh = require('path');
const path = require('path');
const { connect } = require('./post');
const fs = require('fs');
const { profile } = require('console');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, time + path.extname(file.originalname))
    }
})
const time = Date.now()
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


router.post('/pageUpdate', upload.single('picture'),(req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const userId = req.body.userId;
    const picture = req.body.picture;
    const tag = req.body.tag;
    const content = req.body.content;
    const url = req.body.url;
    let today = new Date();   
    const postDate = today;
    let file = req.file;
    console.log('url', url);
		//const files = req.files;
		let originalName = '';
		let fileName = '';
		let mimeType = '';
		let size = 0;
        const profilePic = req.file.filename
        console.log('re', file);
        console.log('hi',profilePic);
        if(file) {
			originalName = file.originalname;
			filename = file.fileName;//file.fileName
			mimeType = file.mimetype;
			size = file.size;
			console.log("execute 2"+fileName);
		} else { 
			console.log("request is null");
		}
    
    console.log(today);
    pool.getConnection((err, conn) => {
        conn.query('UPDATE sns SET user_ID = ?, picture = ?, tag = ?, content = ?, postDate = ?, url = ? WHERE id = ?', [userId, profilePic, tag, content, postDate, url, id], (err, result, fields) => {
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


router.post('/profile', upload.single('picture'), (req, res) => {
    const userId = req.body.userId;
    const picture = req.file;
    console.log(picture);
    try {
		let file = req.file;
		//const files = req.files;
		let originalName = '';
		let fileName = '';
		let mimeType = '';
		let size = 0;
        console.log(req.body);
        // const id = req.body.id;
        console.log('여기1', userId);
        console.log('여기2', picture);
		if(file) {
			originalName = file.originalname;
			filename = file.fileName;//file.fileName
			mimeType = file.mimetype;
			size = file.size;
			console.log("execute 2"+fileName);
		} else { 
			console.log("request is null");
		}
	} catch (err) {
		console.dir(err.stack);
	}
    const profilePic = req.file.filename
    console.log(profilePic);
    setTimeout(() => {
        pool.getConnection((err, conn) => {
            conn.query('UPDATE user SET profile = ? WHERE id = ?', [profilePic, userId], (err, result, fields) => {
                if(err) {
                    console.log(err);
                    res.send('postInsertError');
                }
                else {
    
                    res.send('postInsertSuccess');
                }
            })
            conn.release();
        })

    }, 1000)
})

router.post('/upload', upload.single('picture'), (req, res) => {
    const userId = req.body.userId;
    const picture = req.file;
    console.log('picture', picture);
    const tag = req.body.tag;
    const content = req.body.content;
    const url = req.body.url;
    let today = new Date();   
    const postDate = today;
    try {
		let file = req.file;
		//const files = req.files;
		let originalName = '';
		let fileName = '';
		let mimeType = '';
		let size = 0;
        console.log(req.body);
        // const id = req.body.id;
        console.log('여기1', userId);
        console.log('여기2', picture);
        console.log('여기3', tag);
        console.log('여기4', content);
        console.log('여기5', postDate);
        console.log('여기6', url);
        
        console.log(today);
		if(file) {
			originalName = file.originalname;
			filename = file.fileName;//file.fileName
			mimeType = file.mimetype;
			size = file.size;
			console.log("execute 2"+fileName);
		} else { 
			console.log("request is null");
		}
	} catch (err) {
		console.dir(err.stack);
	}
    const goodPicture = req.file.filename
	console.log('h2',req.file.path);
	console.log('fgg', req.body);
	// res.redirect("/images/" + time + path.extname(req.file.originalname));//fileName

    setTimeout(() => {
        pool.getConnection((err, conn) => {
            conn.query('INSERT INTO sns(id, user_ID, picture, tag, content, postDate, url) VALUES(?, ?, ?, ?, ?, ?, ?)', [null, userId, goodPicture, tag, content, postDate, url], (err, result, fields) => {
                if(err) {
                    console.log(err);
                    res.send('postInsertError');
                }
                else {
    
                    res.send('postInsertSuccess');
                }
            })
            conn.release();
        })

    }, 1000)
})

// 채식 메뉴 10개 리스트
router.post('/vegetableMain', (req, res) => {
    const tasteDiv = req.body.tasteDiv;;
    console.log(tasteDiv);
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM food WHERE taste_div = ? AND category = 1 ORDER BY RAND() LIMIT 10', tasteDiv, (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('Fail');
            }
            else {
                console.log(result);
                res.send(result);
            }
        })
        conn.release();
    })
})

router.get('/images/:upload', function(req, res) {


	var file = req.params.upload;
	console.log(file);
	var img = fs.readFileSync(__dirname + "/../images/" + file);

	res.writeHead(200, {'Content-Type': 'image/png'});
	res.end(img, 'binary');
});

// 육식 메뉴 10개 리스트
router.post('/meatMain', (req, res) => {
    const tasteDiv = req.body.tasteDiv;;
    console.log(tasteDiv);
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM food WHERE taste_div = ? AND category = 2 ORDER BY RAND() LIMIT 10', [tasteDiv], (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('Fail');
            }
            else {
                console.log(result);
                res.send(result);
            }
        })
        conn.release();
    })
})

//디저트 메뉴 10개 리스트
router.post('/dessertMain', (req, res) => {
    const tasteDiv = req.body.tasteDiv;;
    console.log(tasteDiv);
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM food WHERE taste_div = ? AND category = 3 ORDER BY RAND() LIMIT 10', [tasteDiv], (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('Fail');
            }
            else {
                console.log(result);
                res.send(result);
            }
        })
        conn.release();
    })
})

// 기타 메뉴 10개 리스트
router.post('/etcMain', (req, res) => {
    const tasteDiv = req.body.tasteDiv;;
    console.log(tasteDiv);
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM food WHERE taste_div = ? AND category = 4 ORDER BY RAND() LIMIT 10', [tasteDiv], (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('Fail');
            }
            else {
                console.log(result);
                res.send(result);
            }
        })
        conn.release();
    })
})

// 메뉴 클릭했을때 메뉴 데이터 가져오기
router.post('/ingredientSearch', (req, res) => {
    const foodId = req.body.id;
    let list = [];
    let count = 0;
    let finalList = [];
    pool.getConnection((err, conn) => {
        conn.query('select * from food_ingredient where food_id = ?', foodId, (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('fail')
            }
            else {
                console.log(result);
                list = result;
                for(let i = 0; i < list.length; i++) {
                    count = list[i].each_ingredient_id
                    console.log(count);
                    conn.query('SELECT * from each_ingredient WHERE id = ?', count, (err, result, fields) => {
                        console.log(result[0])
                        finalList.push(result[0].name);
                        console.log(finalList)
                    })
                    conn.release();

                }
                setTimeout(() => {
                    res.send(finalList)
                }, 500)
                

            }
        })
        conn.release();
    })
})

// 레시피 한줄 소개
router.post('/getIntroduce', (req, res) => {
    const id = req.body.id;
    pool.getConnection((err, conn) => {
        conn.query('SELECT introduce FROM food WHERE id = ?', id, (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('Fail');
            }
            else {
                console.log('Introduce ',result);
                res.send(result);
            }
        })
        conn.release();
    })
})

// 음식 레시피 순서
router.post('/recipe', (req, res) => {
    const id = req.body.id;
    console.log('recipe', id);
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM recipe WHERE food_id = ?', id, (err, result, fields) => {
            console.log(result);
            res.send(result);
        })
        conn.release();
    })
})

router.post('/frige', (req, res) => {
    const userId = req.body.userId;
    console.log('userId', userId);
    const foodId = req.body.food;
    console.log('foodId', foodId);    
    const list = [];
    for(let j = 0; j < foodId.length; j++) {
        list.push(foodId[j])

    }
    console.log('list', list);
    pool.getConnection((err, conn) => {
        for(let i = 0; i < foodId.length; i++) {
            conn.query('INSERT INTO fridge(user_ID, each_ingredient_id) VALUES (?, ?)', [userId, list[i]], (err, result, fields) => {
                if(err) {
                    console.log(err)
                    res.send('fail');
                }
                else {
                   console.log('hi', result);
                }
            })
            conn.release()
        }
        res.send('succ')
    })
})


// 재료 추가하기 버튼을 눌렀을때 임의에 전체 데이터 뿌려주기
router.get('/ingredientList', (req, res) => {
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM each_ingredient ORDER BY RAND()', (err, result, fields) => {
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

// 유저 냉장고 데이터 조회
router.post('/userFridge', (req, res) => {
    const userId = req.body.userId;
    const frige = [];
    const user = [];
    const id = []
    pool.getConnection((err, conn) => {
        conn.query('SELECT id, each_ingredient_id FROM fridge WHERE user_ID = ?', userId, (err, result, fields) => {
            if(err) {
                console.log(err);
                res.send('fail')
            }
            else {
                for(let i = 0; i < result.length; i++) {
                    frige.push(result[i].each_ingredient_id)
                    id.push(result[i].id)
                }
                console.log(frige);
                pool.getConnection((err, conn) => {
                    for(let j = 0; j < frige.length; j++) {
                        console.log('hi',frige[j])
                        conn.query('SELECT * FROM each_ingredient WHERE id = ?', frige[j], (err, result, fields) => {
                            if(err) {
                                console.log(err);
                                res.send('fail');
                            }
                            else {
                                result[0].ingredient = frige[j];
                                result[0].id = id[j];
                                user.push(result[0])
                                
                                console.log(user);
                            }
                        })
                        conn.release();
                    }
                    console.log(user);
                    setTimeout(() => {
                        
                        res.send(user)
                    }, 1000)
                })

            }
        })
        conn.release();

    })
})
// 유저 재료 삭제
router.post('/ingredientDelete', (req, res) => {
    const id = req.body.id;
    const userId = req.body.userId;
    const list = req.body.ingredient;
    console.log(list.length);
    pool.getConnection((err, conn) => {
        if(err) {
            console.log(err);
            res.send('fail');
        }
        else {
            for(let i = 0; i < list.length; i++) {
                conn.query('DELETE FROM fridge WHERE id = ? AND user_ID = ? AND each_ingredient_id = ?', [id[i], userId, list[i]], (err, result, fields) => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        res.send('hi');
                    }
                })
            }
            conn.release()
        }
    })
})
// 요리하기
router.post('/frigeRecipeList', (req, res) => {
    const userId = req.body.userId;
    const list = [];
    pool.getConnection((err, conn) => {
        conn.query('SELECT * FROM fridge WHERE user_ID = ?', userId, (err, result, fields) => {
            console.log(result);
            const count = result.length
            console.log('count', count);
            for(let i = 0; i < result.length; i++) {
                list.push(result[i].each_ingredient_id) 
            }
            console.log(list)
            pool.getConnection((err, conn) => {
                conn.query('SELECT * FROM food_ingredient WHERE each_ingredient_id IN (?)', [list], (err, result, fields) => {
                    console.log('two result : ',result);
                    let foodId = [];
                    for(let j = 0; j < result.length; j++) {
                        foodId.push(result[j].food_id);
                    }
                    pool.getConnection((err, conn) => {
                        console.log('foodId', foodId);
                        conn.query('SELECT * FROM food WHERE id IN (?)', [foodId], (err, result, fields) => {
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
                conn.release();
            })

        })
        conn.release();
    })
})

module.exports = router;
