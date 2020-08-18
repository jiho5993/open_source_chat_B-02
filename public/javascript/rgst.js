function mySubmit() {
    var pwd = document.getElementsByName('pwd')[0]
    var conf = document.getElementsByName('pwdconf')[0]

    if(pwd.value != conf.value) {
        conf.style.borderColor = "#FF322D"
        return false
    } else return true
}