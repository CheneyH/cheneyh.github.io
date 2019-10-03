/**
 * Created by Cheney on 2019/5/18.
 */
//v1
//旋转中心25,25
$(function () {
    $('.handle').on('mousedown', function (e) {
        let angle = 0, volume = 0;
        let x1 = e.offsetX - 17, y1 = e.offsetY - 25;
        $(this).on('mousemove', function () {
            let x2 = e.offsetX - 17, y2 = e.offsetY - 25;
            angle += Math.atan2(y2, x2) - Math.atan2(y1, x1) * 180 / Math.PI;
            if (angle < 0) angle = 0;
            if (angle > 36000) angle = 36000;
            $('.handle').css('transform', 'rotate(' + angle + 'deg)');
            volume = Math.floor(angle / 360);
            $('.volume_box span').text(volume);
            $('.volume_box .volume_i').css('height', volume + '%');
        });

        $('body').on('mouseup', function () {
            $('.handle').off('mousemove');
        })
    });

    $('.horn').on('mousedown', function () {
        let timer = null;
        clearInterval(timer);
        let angle = 0;
        timer = setInterval(() => {
            if (angle >= 44) clearInterval(timer);
            angle++;
            $(this).css('transform', 'rotate(' + angle * -1 + 'deg)');
            $('.v2 .bg').css('transform', 'scale(' + angle * 66 / 44 + ',' + angle * 66 / 44 + ')');
        }, 30);
        $(this).on('mouseup', function () {
            clearInterval(timer);
            //发射
            console.log(angle);
            let v0 = 20;
            let x = 0, y = 0;
            x = v0 * Math.cos(angle / 180 * Math.PI);
        })
    })
});