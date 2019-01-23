/**
 * 如果你在看这段代码，就知道这个算法有多智能了！:P
 * If you are looking at my code, you'll know how smart my algorithm is! :P
**/


/**
 * ai机器人核心算法
 * @param str 用户输入
 * @returns {string} 返回字符串
 */
function ai_response(str) {
    return str.replace("吗","").replace("?","!").replace("？","！").replace("你","我").replace("我","你");
}

function send(msg) {
    $.ajax({
        method: "get",
        url: "http://i.xiaoi.com/robot/webrobot",
        data: {
            data: '{"sessionId":"a57e1902594c4b3daa9d95f9625bf0a4","robotId":"webbot","userId":"c864f31ea4f0473297395e2798d2cf87","body":{"content":"' + msg + '"},"type":"txt"}',
            ts: 1548134242974
        },
        // 解决跨域问题
        dataType: 'jsonp',
        jsonp: "callback",
        jsonpCallback: "__webrobot_processMsg",
        success: function (data) {
            createDialog(data['body']['content'], "robot");
        },
        error: function (e) {
            createDialog("我饿了，去充电了哦，请小主人稍后再试~", "robot");
        }
    })
}

function format(msg) {
    return msg.replace(/ /g, '&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/→/g, '&rarr;').replace(/←/g, '&larr;');
}