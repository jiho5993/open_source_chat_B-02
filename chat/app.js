var app = require('express')();
var server = require('http').createServer(app);

var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('login', function(data) {
        console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

        socket.name = data.name;
        socket.userid = data.userid;

        io.emit('login', data.name);
    });

    socket.on('chat', function(data) {
        console.log('Message from %s: %s', socket.name, data.msg);
    
        var msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };
        
        // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
        socket.broadcast.emit('chat', msg);

        // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
        // socket.emit('s2c chat', msg);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        // io.emit('s2c chat', msg);

        // 특정 클라이언트에게만 메시지를 전송한다
        // io.to(id).emit('s2c chat', data);
    });

    socket.on('forceDisconnect', function() {
        socket.disconnect();
    });
    
    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.name);
    });
});

var chat = io.of('/chat').on('connection', function(socket) {
    socket.on('chat message', function(data){
        console.log('message from client: ', data);
    
        var name = socket.name = data.name;
        var room = socket.room = data.room;
    
        // room에 join한다
        socket.join(room);
        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        chat.to(room).emit('chat message', data.msg);
    });
});

server.listen(3000, function() {
    console.log('Socket IO server listening on port 3000');
});