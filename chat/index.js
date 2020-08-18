var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var fs = require('fs')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'))

let room = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6', 'room7', 'room8', 'room9', 'room10']
let a = 0

var login = require('./routes/login.js')

var cookieParser = require('cookie-parser');

app.use(cookieParser('data'));
app.use('/', login)

app.get('/main', function (req, res) {
    console.log(req.cookies.username);
    res.render('index.html', {alert: false});
})

app.post('/', function (req, res) {
    var name = req.body.name;
    console.log(`${name} is login!`);

    res.cookie('username', name);
    res.render('main.html', { username: name });
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

server.listen(PORT, function() {
    console.log(`Server on http://localhost:${PORT}`);
})
