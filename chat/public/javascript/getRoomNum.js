let roomNum
// var a = document.getElementById('crNum')
// roomNum = (a.input[a.selectedIndex].value).substring(8, 10) - 1

function get(num) {
    alert('chatRoom ' + num + ' 으로 갑니다...')
    module.exports = num
    var a = document.getElementById('crNum')
    roomNum = (a.input[a.selectedIndex].value).substring(8, 10) - 1
}