(function (window) {
    function Tetris($cvs, img) {
        return new Tetris.prototype.init($cvs, img);
    }

    Tetris.prototype = {
        init: function ($cvs, img) {
            var self = this;
            this.ctx = $cvs.get(0).getContext("2d");
            this.img = img;
            this.img.onload = function () {
                self.getIcons();
                self.initMatrix();
                self.createNext();
                self.run();
                self.setInterval(function () {
                    var date = new Date();
                    self.drawBackground(date);
                    self.drawTime(date);
                })
            }
        },
        rows: 10,
        cols: 20,
        ctx: null,
        icons: [],
        dragons: [],
        running: true,
        clearLine: 0,
        direction: 0, // 0left,1right,2down
        clearSparkTime:0,
        color:["black","black","black","black","black","black","black","black","red"],
        store: [
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ],
            [
                [2, 0, 0],
                [2, 0, 0],
                [2, 2, 0]
            ],
            [
                [0, 3, 0],
                [3, 3, 0],
                [3, 0, 0]
            ],
            [
                [4, 0, 0],
                [4, 4, 0],
                [0, 4, 0]
            ],
            [
                [5, 5, 0],
                [5, 0, 0],
                [5, 0, 0]
            ],
            [
                [6, 6],
                [6, 6]
            ],
            [
                [0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 0, 0]
            ],
        ],
        matrix: null,
        current: null,
        currentPosition: [3, -1],
        next: [],
        dragonTimer: null,
        initMatrix: function () {
            this.matrix = new Array(10);
            this.current = new Array(10);
            for (var i = 0; i < 10; i++) {
                this.matrix[i] = new Array(20);
                this.current[i] = new Array(20);
                for (var j = 0; j < 20; j++) {
                    this.matrix[i][j] = 0;
                    this.current[i][j] = 0;
                }
            }

        },
        getIcons: function () {
            for (var i = 0; i < 13; i++) {
                // sx:剪切x坐标,sy:剪切y坐标,swidth:剪切的宽度,sheight:剪切的高度
                this.icons[i] = {sx: 75 + i * 14, sy: 25, swidth: 14, sheight: 25};
            }

            this.icons.push({sx: 150, sy: 75, swidth: 25, sheight: 20});
            this.icons.push({sx: 175, sy: 75, swidth: 25, sheight: 20});
            this.icons.push({sx: 75, sy: 75, swidth: 20, sheight: 18});
            this.icons.push({sx: 100, sy: 75, swidth: 20, sheight: 18});

            this.dragons.push({sx: 0, sy: 100, swidth: 80, sheight: 86});
            this.dragons.push({sx: 100, sy: 100, swidth: 80, sheight: 86});
            this.dragons.push({sx: 200, sy: 100, swidth: 80, sheight: 86});
            this.dragons.push({sx: 300, sy: 100, swidth: 80, sheight: 86});
        },
        drawBackground: function (date) {
            this.ctx.fillStyle = "#9ead86";
            this.ctx.fillRect(0, 0, 280, 350);
            this.ctx.strokeStyle = "#000";
            this.ctx.strokeRect(2, 2, 175, 346);
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 20; j++) {
                    this.drawRect(i, j, "#879372")
                }
            }

            this.ctx.strokeStyle = "#000";
            this.ctx.fillStyle = "#000";
            this.ctx.font = "13px 微软雅黑";
            this.ctx.fillText("得分", 190, 30);
            this.ctx.fillText("消除", 190, 90);
            this.ctx.fillText("关卡", 190, 150);
            this.ctx.fillText("下一个", 190, 210);
            // ctx.drawImage(img,75,25,14,25,200,35,10,19);
            // 暗8
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 6; j++) {
                    this.ctx.drawImage(this.img, this.icons[10].sx, this.icons[10].sy, this.icons[10].swidth, this.icons[10].sheight, 210 + j * 10, 40 + i * 60, 10, 19);
                }
            }

            // 关卡
            this.ctx.drawImage(this.img, this.icons[10].sx, this.icons[10].sy, this.icons[10].swidth, this.icons[10].sheight, 260, 160, 10, 19);
            this.ctx.strokeStyle = "#879372";
            this.ctx.fillStyle = "#879372";
            // 下一个图案
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 2; j++) {
                    this.ctx.strokeRect(i * 17 + 205, j * 17 + 225, 14, 14);
                    this.ctx.fillRect(i * 17 + 207.5, j * 17 + 227.5, 9, 9);
                }
            }

            // ctx.drawImage(img, 150, 75, 25, 20, 186, 330, 16, 12); 有声音
            this.ctx.drawImage(this.img, this.icons[14].sx, this.icons[14].sy, this.icons[14].swidth, this.icons[14].sheight, 186, 330, 16, 12); // 静音图标
            this.ctx.drawImage(this.img, this.icons[16].sx, this.icons[16].sy, this.icons[16].swidth, this.icons[16].sheight, 206, 330, 16, 12); // 暂停图标

            // 小恐龙动画
            if (this.running !== true) {
                this.drawDragon(date);
            } else {
                // 绘制下一个图案
                this.drawNext();

                // 绘制当前的图案
                this.drawCurrent();

                // 绘制矩阵
                this.drawMatrix();

                if(this.clearSparkTime < 20){
                    this.clearSparkTime ++;
                }else{
                    this.clear();
                    this.clearSparkTime = 0;
                }

                // 绘制消除行数
                this.drawClearLine(this.clearLine.toString());
                this.drawScore((this.clearLine*80).toString())

                if(Math.floor(date.getTime() % 500) === 0){
                    this.down();
                }
            }

        },
        drawRect: function (i, j, color) {
            this.ctx.strokeStyle = color;
            this.ctx.fillStyle = color;
            this.ctx.strokeRect(i * 17 + 6, j * 17 + 6, 14, 14);
            this.ctx.fillRect(i * 17 + 8.5, j * 17 + 8.5, 9, 9);
        },
        drawScore: function (score) {
            // 绘制分数
            for (var i = score.length - 1; i >= 0; i--) {
                this.ctx.drawImage(this.img, this.icons[score[i]].sx, this.icons[score[i]].sy, this.icons[score[i]].swidth, this.icons[score[i]].sheight, 270 - (score.length - i) * 10, 40, 10, 19);
            }
        },
        drawClearLine: function (clearLine) {
            for (var i = clearLine.length - 1; i >= 0; i--) {
                this.ctx.drawImage(this.img, this.icons[clearLine[i]].sx, this.icons[clearLine[i]].sy, this.icons[clearLine[i]].swidth, this.icons[clearLine[i]].sheight, 270 - (clearLine.length - i) * 10, 100, 10, 19);
            }
        },
        drawLevel: function (level) {
            this.ctx.drawImage(this.img, this.icons[level].sx, this.icons[level].sy, this.icons[level].swidth, this.icons[level].sheight, 260, 160, 10, 19);
        },
        drawTime: function (date) {
            var timeStr = date.toTimeString().slice(0, 5);
            var second = date.getSeconds();
            // 绘制时间
            for (var i = 0; i < 5; i++) {
                if (i === 2) {
                    if (second % 2 === 0) {
                        this.ctx.drawImage(this.img, this.icons[11].sx, this.icons[11].sy, this.icons[11].swidth, this.icons[11].sheight, 245, 327, 10, 19);
                    } else {
                        this.ctx.drawImage(this.img, this.icons[12].sx, this.icons[12].sy, this.icons[12].swidth, this.icons[12].sheight, 245, 327, 10, 19);
                    }
                } else {
                    this.ctx.drawImage(this.img, this.icons[timeStr[i]].sx, this.icons[timeStr[i]].sy, this.icons[timeStr[i]].swidth, this.icons[timeStr[i]].sheight, 225 + i * 10, 327, 10, 19);
                }
            }
        },
        drawDragon: function (date) {
            this.ctx.save();
            var i = Math.floor(date.getTime() / 80);
            if (i % 100 < 50) {
                this.ctx.transform(-1, 0, 0, 1, 180, 0); // 翻转画布
            } else {

            }
            if (i % 4 === 0) {
                this.ctx.drawImage(this.img, this.dragons[2].sx, this.dragons[2].sy, this.dragons[2].swidth, this.dragons[2].sheight, 50, 80, 80, 86);
            }
            else if (i % 4 === 1) {
                this.ctx.drawImage(this.img, this.dragons[3].sx, this.dragons[3].sy, this.dragons[3].swidth, this.dragons[3].sheight, 50, 80, 80, 86);
            } else if (i % 4 === 2) {
                this.ctx.drawImage(this.img, this.dragons[2].sx, this.dragons[2].sy, this.dragons[2].swidth, this.dragons[2].sheight, 50, 80, 80, 86);
            } else if (i % 4 === 3) {
                this.ctx.drawImage(this.img, this.dragons[3].sx, this.dragons[3].sy, this.dragons[3].swidth, this.dragons[3].sheight, 50, 80, 80, 86);
            }
            this.ctx.restore();
        },
        createNext: function () {
            if (this.next.length === 0) {
                this.current = shuffle(this.store);
                this.next = shuffle(this.store);
            } else {
                for (var i = 0; i < this.current.length; i++) {
                    for (var j = 0; j < this.current[0].length; j++) {
                        if (this.current[i][j] !== 0) {
                            this.matrix[i + this.currentPosition[0]][j + this.currentPosition[1]] = this.current[i][j];
                        }
                    }
                }
                this.currentPosition = [3, -1];
                this.current = clone(this.next);
                this.next = shuffle(this.store);
                this.checkClear();
            }
        },
        drawNext: function () {
            for (var i in this.next) {
                for (var j in this.next[0]) {
                    if (this.next[i][j] !== 0) {
                        this.ctx.fillStyle = this.color[this.next[i][j]];
                        this.ctx.strokeStyle = this.color[this.next[i][j]];
                        this.ctx.strokeRect(i * 17 + 205, j * 17 + 225, 14, 14);
                        this.ctx.fillRect(i * 17 + 207.5, j * 17 + 227.5, 9, 9);
                    }
                }
            }
        },
        drawCurrent: function () {
            for (var i = 0; i < this.current.length; i++) {
                for (var j = 0; j < this.current[0].length; j++) {
                    if (this.current[i][j] !== 0 && (j + this.currentPosition[1]) >= 0) {
                        this.drawRect(i + this.currentPosition[0], j + this.currentPosition[1], this.color[this.current[i][j]]);
                    }
                }
            }
        },
        drawMatrix: function () {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 20; j++) {
                    if (this.matrix[i][j] !== 0) {
                        this.drawRect(i, j, this.color[this.matrix[i][j]]);
                    }
                }
            }
        },
        restart: function (date) {
            var j = Math.floor(date.getTime() / 100 % 20);
            for (var i = 0; i < 10; i++) {
                this.drawRect(i, j, "#000")
            }
        },
        down: function () {
            this.direction = 2;
            if (this.checkTouch()) {
                this.createNext();
                return false;
            } else {
                this.currentPosition[1]++;
            }
        },
        left: function () {
            this.direction = 0;
            if (this.checkTouch()) {
                return false;
            } else {
                this.currentPosition[0]--;
            }
        },
        right: function () {
            this.direction = 1;
            if (this.checkTouch()) {
                return false;
            } else {
                this.currentPosition[0]++;
            }
        },
        rotate: function () {
            var temp = new Array(this.current[0].length);
            for (var i = 0; i < this.current.length; i++) {
                temp[i] = new Array(this.current.length);
            }

            for (var i = 0; i < this.current.length; i++) {
                for (var j = 0; j < this.current[0].length; j++) {
                    if(this.current[0].length - 1 - j + this.currentPosition[0] < 0 || this.current[0].length - j + this.currentPosition[0] > 10){
                        return false;
                    }
                    temp[this.current[0].length - 1 - j][i] = this.current[i][j];
                }
            }
            this.current = clone(temp);
        },
        checkTouch: function () {
            var flag = false;
            var min_x = 10, max_x = 0, max_y = 0;
            for (var i = 0; i < this.current.length; i++) {
                for (var j = 0; j < this.current[0].length; j++) {
                    if (this.current[i][j] !== 0) {
                        if (i > max_x) {
                            max_x = i;
                        }
                        if (i < min_x) {
                            min_x = i;
                        }
                        if (j > max_y) {
                            max_y = j;
                        }
                    }
                }
            }

            if (this.direction === 0) {
                // left
                for (var i = 0; i < this.current.length; i++) {
                    for (var j = 0; j < this.current[0].length; j++) {
                        if ((this.currentPosition[0] + min_x) === 0 || (this.current[i][j] !== 0 && this.matrix[i + this.currentPosition[0] + min_x -1][j + this.currentPosition[1]] === 1)) {
                            flag = true;
                        }
                    }
                }
            } else if (this.direction === 1) {
                // right
                for (var i = 0; i < this.current.length; i++) {
                    for (var j = 0; j < this.current[0].length; j++) {
                        if ((this.currentPosition[0] + max_x + 1) === 10 || (this.current[i][j] !== 0 && this.matrix[this.currentPosition[0] + i + 1][j + this.currentPosition[1]] === 1)) {
                            flag = true;
                        }
                    }
                }
            } else if (this.direction === 2) {
                // down
                for (var i = 0; i < this.current.length; i++) {
                    for (var j = 0; j < this.current[0].length; j++) {
                        if (this.current[i][j] !== 0 && this.matrix[i + this.currentPosition[0]][j + this.currentPosition[1] + 1] !== 0 || (this.currentPosition[1] + max_y + 1) === 20) {
                            flag = true;
                        }
                    }
                }
            }
            return flag;
        },
        checkClear: function () {
            for (var i = 0; i < 20; i++) {
                var count = 0;
                for (var j = 0; j < 10; j++) {
                    if(this.matrix[j][i] !== 0){
                        count ++;
                    }
                }
                if(count === 10){
                    this.clearLine ++;
                    for(var k=0;k<10;k++){
                        this.matrix[k][i] = 8;
                    }
                }
            }
        },
        clear:function(){
            for (var i = 0; i < 20; i++) {
                    for(var j=0;j<10;j++){
                        if(this.matrix[j][i] === 8){
                            this.matrix[j].splice(i,1);
                            this.matrix[j].unshift(0);
                        }
                    }
            }
        },
        append: function () {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 20; j++) {
                    if (this.current[i][j] !== 0) {
                        this.matrix[i][j] = this.current[i][j];
                    }
                }
            }
        },
        setInterval: function (fn) {
            var timer = setInterval(function () {
                fn();
            }, 20);
        },
        run:function () {
            var self = this;
            setInterval(function () {
                self.down();
            },400);
        },
        pause:function () {
            
        }
    };

    Tetris.prototype.init.prototype = Tetris.prototype;
    window.Tetris = Tetris;

    // 工具函数
    // 随机返回数组中的一个
    function shuffle(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return clone(arr[index]);
    }

    function clone(arr, _i = 0, _j = 0) {
        var tempArr = new Array(arr.length);
        for (var i = 0; i < arr.length; i++) {
            tempArr[i] = new Array(arr[0].length);
            for (var j = 0; j < arr[0].length; j++) {
                tempArr[i + _i][j + _j] = arr[i][j];
            }
        }
        return tempArr;
    }

})(window);