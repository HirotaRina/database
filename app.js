var sqlite3 = require('sqlite3').verbose()
var bodyParser = require('body-parser')
const express = require('express')
const app = express()
app.use(express.static('public'));
app.set('view engine', 'pug')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())

var db = new sqlite3.Database('instagram.db')

app.get('/', function (req, res, next) {
    var query = "\
        SELECT p.post_id, p.account,u.name, i.photo_id,\
	(SELECT count(*) FROM follow f WHERE f.follower_id='tomo.y9') as followee_count,\
        (SELECT count(*) FROM follow f WHERE f.followee_id='tomo.y9') as follower_count,\
	(SELECT count(*) FROM post p WHERE p.account='tomo.y9') as post_count\
        FROM post p, user u, include i\
        WHERE p.account = 'tomo.y9' and p.account=u.account and i.post_id=p.post_id;\
        ";

        console.log("DBG:" + query);
    db.all(query, {}, function (err, rows) {
        if (err) {
            console.log("ERROR: " + err.message);
        }
        res.render('index', {
            results: rows
        })
    })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

