$(function () {
    var socket = io()

    socket.emit('login', {username: username})

    socket.on('login', function (data) {
        $('#chatLog').append('<li><strong>' + data + '</strong> has entered</li>')
    })
    socket.on('logout', function (data) {
        $('#chatLog').append('<li><strong>' + data + '</strong> has exited</li>')
    })
    socket.on('chat', function (data) {
        $('#chatLog').append('<li><strong>' + data.username + '</strong> : ' + data.msg + '</li>')
    })

    $('#myForm').submit(function (e) {
        e.preventDefault()
        var $msgForm = $('#msgForm')
        socket.emit('chat', {msg: #msgForm.val()})
        $msgForm.val('')
    })
})