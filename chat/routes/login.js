var express = require('express')
var app = express()
var mysql = require('mysql')
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    post : 3306,
    password : '1234',
    database : 'my_db'
})

app.get('/', function (req, res) {
    console.log('open index.html')
    res.render('index.html', { alert: false })
})

module.exports = app