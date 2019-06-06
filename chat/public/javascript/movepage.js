var app = require('express')()
var username = ($('p[id=username]').text()).substring(11)

app.get('/chat', function (req, res) {
    res.render('chat.html', { roomNum: roomNum-1, username: username})
})

module.exports = app