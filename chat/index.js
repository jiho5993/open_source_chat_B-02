var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'))

let room = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6', 'room7', 'room8', 'room9', 'room10']
let a = 0

// 라우팅 처리
app.get('/', function(req, res) { // req 는 request, res 는 respond, 대부분은 여기서 관리함
    console.log('open index.html')
    res.render('index.html', { alert: false })
})
app.post('/', function(req, res) { // 로그인시
    var name = req.body.name
    var pwd = req.body.pwd

    // db에 쿼리 전송
    var qr = `select * from user_info where username = ?` // 작은 따옴표가 아님
    connection.query(qr, [name], function(error, results, fields) { // 인자를 받아서 qr의 ?에 순서대로 들어감
        if(results.length == 0) res.render('index.html', {alert: true})
        else {
            var db_pwd = results[0].password
            if(pwd == db_pwd) {
                console.log('open chat.html')
                res.render('chat.html', { username: name })
            }
            else res.render('index.html', {alert: true})
        }
    })
})

app.get('/register', function(req, res) {
    console.log('open register.html')
    res.render('register.html')
})

app.post('/register', function(req, res) { // 회원가입시
    var name = req.body.name
    var pwd = req.body.pwd
    var pwdconf = req.body.pwdconf

    var qr = `insert into user_info values (?, ?)`
    connection.query(qr, [name, pwd], function(error, result, fields) {
        console.log(result)
    })

    res.redirect('/') // 첫 페이지로 돌아감
})

// ejs view와 렌더링 설정
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
    socket.on('chat', function (data) {
        console.log('Message form %s : %s', socket.username, data.msg)
        var msg = {
            username: socket.username,
            msg: data.msg
        }
        io.emit('chat', msg)
    })

    socket.on('joinRoom', function(num, name) {
        socket.join(room[num], () => {
            console.log(num)
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

    // socket.on('disconnect', function () {
    //     socket.broadcast.emit('logout', socket.username)
    //     console.log('user disconnected: ' + socket.username)
    // })
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
