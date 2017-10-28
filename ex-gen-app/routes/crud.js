var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3'); //sqlite3追加

//データベースオブジェクトの取得
var db = new sqlite3.Database('mydb.sqlite3');

/* GET home page. */
router.get('/', (req, res, next) => {
    //データベースのシリアライズ
    db.serialize(() => {
        //レコードをすべて取り出す
        db.all("select * from mydata", (err, rows) => {
            //データベースアクセス完了時の処理
            if (!err) {
                var data = {
                    title: 'Hello!',
                    content: rows //取得したレコードデータ
                };
                res.render('crud/index', data);
            }
        });
    });
});

router.get('/add', (req, res, next) => {
    var data = {
        title: 'Crud/Add',
        content: '新しいレコードを入力'
    }
    res.render('crud/add', data);
});

router.post('/add', (req, res, next) => {
    var nm = req.body.name;
    var ml = req.body.mail;
    var ag = req.body.age;
    db.run('insert into mydata(name,mail,age) values (?,?,?)', nm, ml, ag);
    res.redirect('/crud');
})

/*show*/
router.get('/show', (req, res, next) => {
    var id = req.query.id;
    db.serialize(() => {
        var q = "select * from mydata where id =?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'Crud/show',
                    content: 'id = ' + id + ' のレコード',
                    mydata: row
                }
                res.render('crud/show', data);
            }
        })
    });
})

/*edit*/
router.get('/edit', (req, res, next) => {
    var id = req.query.id;
    db.serialize(() => {
        var q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'crud/edit',
                    content: 'id = ' + id + 'のレコードを編集 : ',
                    mydata: row
                }
                res.render('crud/edit', data);
            }
        });
    });
});

router.post('/edit', (req, res, next) => {
    var id = req.body.id;
    var name = req.body.name;
    var mail = req.body.mail;
    var age = req.body.age;
    var q = "update mydata set name = ?,mail = ?,age = ? where id = ?";
    db.run(q, name, mail, age, id);
    res.redirect('/crud');
});

/*delete*/
router.get('/delete', (req, res, next) => {
    var id = req.query.id;
    db.serialize(() => {
        var q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: "crud/delete",
                    content: 'id = ' + id + 'のレコードを削除 : ',
                    mydata: row
                }
                res.render('crud/delete', data);
            }
        });
    });
});

router.post('/delete', (req, res, next) => {
    var id = req.body.id;
    var q = "delete from mydata where id = ?";
    db.run(q, id);
    res.redirect('/crud');
})

module.exports = router;