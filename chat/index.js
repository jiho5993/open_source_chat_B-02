var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var fs = require('fs')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'))

let room = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6', 'room7', 'room8', 'room9', 'room10']
let a = 0
let userName

var login = require('./routes/login.js')
app.use('/', login)

app.post('/', function (req, res) {
    var name = req.body.name
    var pwd = req.body.pwd
    userName = name

    var qr = `select * from user_info where username = ?`
    connection.query(qr, [name], function(error, results, fields) {
        if(results.length == 0) res.render('index.html', {alert: true})
        else {
            var db_pwd = results[0].password
            if(pwd == db_pwd) {
                console.log('open main.html')
                res.render('main.html', { username: name })
            }
            else res.render('index.html', { alert: true })
        }
    })
})

var register = require('./routes/register.js')
app.use('/register', register)

app.post('/register', function(req, res) {
    var name = req.body.name
    var pwd = req.body.pwd
    var pwdconf = req.body.pwdconf

    var qr = `insert into user_info values (?, ?)`
    connection.query(qr, [name, pwd], function(error, result, fields) {
        console.log(result)
    })

    res.redirect('/')
})

app.post('/chat', function(req, res) {
    // var rm = require('./public/javascript/getRoomNum')
    // var n = rm.num
    // console.log('name', userName, 'num', n)
    res.render('chat.html', { username: userName })
})

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    post : 3306,
    password : 'qkrwlgh1004@@',
    database : 'my_db'
})

io.on('connection', function (socket) {
    socket.on('login', function (data) {
        console.log('client logged-in: ' + data.username)
        socket.username = data.username
        io.emit('login', data.username)
    })

    socket.on('joinRoom', function(num, name) {
        socket.join(room[num], () => {
            console.log(name + ' join a ' + room[num])
            io.to(room[num]).emit('joinRoom', num, name)
        })
    })
    socket.on('leaveRoom', function(num, name) {
        socket.leave(room[num], () => {
            console.log(name + ' leave a ' + room[num])
            io.to(room[num]).emit('leaveRoom', num, name)
        })
    })
    socket.on('chat message', function(num, name, msg) {
        a = num
        io.to(room[a]).emit('chat message', name, msg)
    })
})
connection.connect(function(err) {
    if(err) {
        console.error('ERR : ' + err.stack)
        return;
    }
    console.log('Success DB connection')
})

server.listen(3000, function() {
    console.log('Server on!')
})
