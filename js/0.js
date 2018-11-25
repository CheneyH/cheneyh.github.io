$(function () {
    /*播放器初始化操作*/
    const app = new APlayer({
        container: document.getElementById('aplayer'),
        audio: [{
            name: 'Enchanted',            //<!-- 歌曲名称-->
            artist: 'Taylor Swift',          //<!-- 歌曲作者-->
            url: 'music/Enchanted.mp3',     // <!-- 歌曲路径-->
            cover: 'music/Enchanted.jpg',  //<!-- 歌曲封面图片-->
            autoplay: true,     // （可选) 自动播放，移动端浏览器暂时不支持此功能
            theme: '#46718b',           //<!-- 选中歌曲的主题-->
        }]
    });

    var aplayer_img = document.getElementsByClassName('aplayer-img')[0];
    app.on('play', function () {
        aplayer_img.style.animationPlayState = 'running';
        $(".aplayer-body .wave li").animate({opacity:"1"}).css("animation-play-state", "running");
    });

    app.on('pause', function () {
        aplayer_img.style.animationPlayState = 'paused';
        $(".aplayer-body .wave li").css("animation-play-state", "paused").animate({opacity:"0"});
    });

    /*首页文章卡片布局*/
    if (document.location.pathname === '/') {
        $(".comments").css("display", "none");
        $(".article").css("border-radius", 0).css("box-shadow", "10px 10px 10px #ccc");
    }

    /*细节优化*/

});