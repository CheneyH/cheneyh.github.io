$(function () {
    createDialog("Hi，我是小i机器人，我可以查天气，讲笑话，订机票哦~ 除此之外还有几十项实用好玩的功能哦~ 快来试试吧", 'robot');

    $('.submit').on('click', function () {
        let msg = $('.message-bar textarea').prop("value");
        if (msg.trim().length === 0) return;
        createDialog(format(msg), 'human');
        send(msg);
        $('.message-bar textarea').prop("value", "");
    });

    $('.message-bar textarea').on('keydown', function (event) {
        var event = event || window.event;
        if (event.key === 'Enter' && event.ctrlKey) {
            // 添加换行符
            // $('.message-bar textarea').get(0).value += '\n';
        } else if (event.key === 'Enter') {
            // 避免回车键换行
            event.preventDefault();
            $('.submit').trigger('click');
        }
    })
});

function createDialog(msg, cl) {
    let timeStr = getNowTime();
    let dialog = ' <div class="chat-message ' +
        cl +
        '">\n' +
        '<div class="makeup">' +
        msg +
        '<span>' + timeStr +
        '</span></div>\n' +
        '        </div>';
    // $('.chat-screen').animate({"scrollTop":$('.chat-screen').prop("scrollHeight")},100);
    if (cl === "human") {
        $('.chat-screen').append(dialog).scrollTop($('.chat-screen').prop("scrollHeight"));
    } else {
        let len = msg.length;
        $(".top-bar div").addClass("loading");
        clearTimeout(timer);
        var timer = setTimeout(function () {
            $(".top-bar div").removeClass("loading");
            $('.chat-screen').append(dialog).scrollTop($('.chat-screen').prop("scrollHeight"));
        }, len * 50)
    }
}

function getNowTime() {
    let now = new Date();
    let hour = ('0' + now.getHours()).slice(-2);
    let min = ('0' + now.getMinutes()).slice(-2);
    return hour + ':' + min;
}
