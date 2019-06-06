var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    console.log('open register.html')
    res.render('register.html')
})

module.exports = app