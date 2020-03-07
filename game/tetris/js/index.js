$(function () {
    var sound = new Sound("source/music.mp3");
    //sound.volume = 0;
    var img = new Image();
    img.src = "source/TB1qq7kNXXXXXacXFXXXXXXXXXX-400-186.png";
    var $cvs = $("canvas");
    var tetris;
    initTetris();
    initEvent();

    function initTetris() {
        tetris = new Tetris($cvs,img);
    }

    function initEvent() {
        $(".down").on("click",function () {
            sound.playMove();
            tetris.down();
        });

        $(".left").on("click",function () {
            sound.playMove();
            tetris.left();
        });

        $(".right").on("click",function () {
            sound.playMove();
            tetris.right();
        });

        $(".rotate").on("click",function () {
            sound.playRotate();
            tetris.rotate();
        });

        $(document).on("keydown", function (event) {
            var key = event.key;
            if (key === " ") {
                $(".start").trigger("click");
            }
            var direction = key.slice(5).toLowerCase();
            if (direction === "left") {
                $(".left a").trigger("click");
            } else if (direction === "down") {
                $(".down a").trigger("click");
            } else if (direction === "right") {
                $(".right a").trigger("click");
            } else if (direction === "up") {
                $(".rotate a").trigger("click");
            }
        });
    }
});