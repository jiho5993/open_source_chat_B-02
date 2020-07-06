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

var login = require('./routes/login.js')

var cookieParser = require('cookie-parser');

app.use(cookieParser('data'));
app.use('/', login)

app.get('/main', function (req, res) {
    console.log(req.cookies.username)
    var exit_sq = `update user_info set state = 0 where username = ?`
    connection.query(exit_sq, [req.cookies.username], function (err, result, fld) {
        console.log(result)
    })
    res.render('index.html', {alert: false})
})

app.post('/', function (req, res) {
    var name = req.body.name
    var pwd = req.body.pwd

    var qr = `select * from user_info where username = ?`
    connection.query(qr, [name], function(error, results, fields) {
        if(results.length === 0) {
            res.render('index.html', {alert: true})
            console.log('no-id')
        }
        else {
            var db_pwd = results[0].password
            var chk_qr = `select * from user_info where username = ?`
            connection.query(chk_qr, [name], function (err, result, fld) {
                if(!result[0].state) {
                    if(pwd === db_pwd) {
                        var update_qr = `update user_info set state = 1 where username = ?`
                        connection.query(update_qr, [name], function (err, result, fld) {
                            console.log(result)
                        })
                        res.cookie('username', name);
                        console.log('open main.html')
                        res.render('main.html', { username: name })
                    }
                    else res.render('index.html', { alert: true })
                } else res.render('index.html', { alert: true })
            })
        }
    })
})

var register = require('./routes/register.js')
app.use('/register', register)

app.post('/register', function(req, res) {
    var name = req.body.name
    var pwd = req.body.pwd
    var pwdconf = req.body.pwdconf

    console.log(name + " " + pwd);

    var qr = `insert into user_info values (?, ?, 0)`
    connection.query(qr, [name, pwd], function(error, result, fields) {
        console.log(result)
    })

    res.redirect('/')
})

app.post('/chat', function(req, res) {
    var rm = req.body.rn
    var userName = req.cookies.username

    res.render( 'chat.html', { username: userName, room_no: rm } )
 })

app.get('/chat', function (req, res) {
    var userName = req.cookies.username
    res.render( 'main.html', { username: userName } )
})

app.get('/renderImg', function (req, res) {
    fs.readFile('./views/img/avatar.png', function (err, data) {
        if(err) console.log('img load ERR!!')
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(data)
        }
    })
})

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    post : 3306,
    password : '1234',
    database : 'my_db'
})

io.on('connection', function (socket) {


    socket.on('login', function (data) {
        console.log('client logged-in: ' + data.username)
        socket.username = data.username
        io.emit('login', data.username)
    })

    socket.on('data_send', function(name){
        console.log('send user_name: ' + name)
        socket.emit()

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
