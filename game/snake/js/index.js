$(function () {
    var mapW, mapH;
    var snake;
    var cvs, cxt;
    initCanvas(); // 初始化画板
    var snake_head = new Image();
    snake_head.src = "source/head.png";
    var snake_body = new Image();
    snake_body.src = "source/body.png";
    var gameover = new Image();
    gameover.src = "source/GameOver.png";
    var food_img = new Image();
    food_img.src = "source/strawberry.png";
    var speed = 1;
    var maxScore = getCookie("m_s") || 0;

    gameover.onload = function () {
        initEvent();
        initSnake();
    };

    function initCanvas() {
        mapW = Math.floor(($(".contain").width() - $(".main").width()) / 20 - 1);
        mapH = Math.floor(($(".contain").height()) / 20 - 1);
        //console.log(mapW, mapH);
        var cvsw = mapW * 20;
        var cvsh = mapH * 20;
        var $cvs = $("<canvas>");
        $cvs.attr("width", cvsw);
        $cvs.attr("height", cvsh);
        $(".contain").append($cvs);

        cvs = $("canvas").get(0);
        cxt = cvs.getContext("2d");
    }

    function initBackground() {
        cxt.fillStyle = "rgba(200,200,200,0.1)";
        cxt.fillRect(0, 0, mapW * 20, mapH * 20);
        for (var i = 0; i < mapW; i++) {
            for (var j = 0; j < mapH; j++) {
                cxt.fillStyle = "#fff";
                cxt.fillRect(i * 20 + 1, j * 20 + 1, 18, 18);
            }
        }
        cxt.fillStyle = "rgba(0,0,133,0.3)";
        cxt.font = "15px 微软雅黑";
        cxt.fillText("贪吃蛇小游戏", 10, 30);
        cxt.fillText("@Cheney", mapW * 20 - 76, mapH * 20 - 6);
    }

    function initSnake() {
        snake = new Snake(mapW, mapH); // 生成贪吃蛇
        drawSnake(snake); // 绘制贪吃蛇
    }

    function drawSnake(snake) {
        cxt.clearRect(0, 0, mapW * 20, mapH * 20);
        initBackground();
        $.each(snake.body, function (index, point) {
            cxt.translate(Math.floor(point % mapW) * 20 + 10, Math.floor(point / mapW) * 20 + 10); // 画布平移
            cxt.rotate(-Math.PI / 2 * snake.path[index]); // 画布旋转
            if (index === 0) {
                cxt.drawImage(snake_head, -10, -10);
            } else {
                cxt.drawImage(snake_body, -10, -10);
            }
            cxt.rotate(Math.PI / 2 * snake.path[index]);
            cxt.translate(-Math.floor(point % mapW) * 20 - 10, -Math.floor(point / mapW) * 20 - 10); // 画布平移
        });

        $.each(snake.food, function (index, point) {
            cxt.drawImage(food_img, point % mapW * 20, Math.floor(point / mapW) * 20);
        });

        cxt.fillStyle = "rgba(0,0,133,0.3)";
        cxt.font = "15px 微软雅黑";
        if (maxScore < 100 * snake.length) {
            maxScore = 100 * snake.length;
            document.cookie = "m_s=" + maxScore;
        }
        var tempStr = "最高分：" + maxScore + "  " + "得分：" + 100 * snake.length;
        cxt.fillText(tempStr, mapW * 20 - tempStr.length * 10 - 25, 30);
    }

    function initEvent() {
        $(document).on("keydown", function (event) {
            var key = event.key;
            if (key === " ") {
                $(".start").trigger("click");
            }
            var direction = key.slice(5).toLowerCase();
            if (snake.direction === 0 && direction === "left") {
                return false;
            } else if (snake.direction === 1 && direction === "down") {
                return false;
            } else if (snake.direction === 2 && direction === "right") {
                return false;
            } else if (snake.direction === 3 && direction === "up") {
                return false;
            }
            switch (direction) {
                case "right":
                    snake.direction = 0;
                    break;
                case "up":
                    snake.direction = 1;
                    break;
                case "left":
                    snake.direction = 2;
                    break;
                case "down":
                    snake.direction = 3;
                    break;
            }
        });

        $(".start").on("click", function () {
            if (snake.paused === false && snake.alive === true) {
                snake.paused = true;
                $(".start span").text("继续游戏");
            } else if (snake.paused === true && snake.alive === true) {
                $(".level").addClass("disabled").off("mouseover");
                snake.paused = false;
                $(".start span").text("暂停游戏");
                snake.move(speed, function () {
                    drawSnake(snake); // 绘制贪吃蛇
                }, function () {
                    $(".level").removeClass("disabled").on("mouseover", function () {
                        $(".levels").stop().slideDown();
                    });
                    $(".start span").text("重新开始");
                    cxt.drawImage(gameover, mapW * 10 - 210, mapH * 8);
                });
            } else {
                initSnake();
                $(".level").addClass("disabled").off("mouseover");
                snake.paused = false;
                $(".start span").text("暂停游戏");
                snake.move(speed, function () {
                    drawSnake(snake); // 绘制贪吃蛇
                }, function () {
                    $(".level").removeClass("disabled").on("mouseover", function () {
                        $(".levels").stop().slideDown();
                    });
                    $(".start span").text("重新开始");
                    cxt.drawImage(gameover, mapW * 10 - 210, mapH * 8);
                });
            }
        });

        $(".level").on("mouseover", function () {
            $(".levels").stop().slideDown();
        });

        $(".level").on("mouseout", function () {
            $(".levels").stop().slideUp();
        });

        $.each($(".levels li"), function () {
            $(this).on("click", function () {
                $(this).addClass("cur");
                $(this).siblings().removeClass("cur");
                $(".levels").stop().slideUp();
                $(".level span").text("难度：" + $(this).text());
                speed = $(this).text();
            });
        })
    }

    function getCookie(key) {
        var arr, reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
        return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
    }
});
