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
                self.createNext();
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
        direction: 0, // 0left,1right,2down
        store: [
            [{x: 1, y: 1}, {x: 0, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}], // ——
            [{x: 1, y: 1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 2, y: 1}], // 土
            [{x: 0, y: 1}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}], // L
            [{x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}], // L
            [{x: 1, y: 0}, {x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], // ㄣ
            [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}], // ㄣ
            [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}], // 方块
        ],
        matrix: [],
        current: [],
        next: [],
        dragonTimer: null,
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
                this.current = shuffle(this.store, 4);
                this.next = shuffle(this.store);
            } else {
                this.current = [];
                this.current = clone(this.next, 4);
                this.next = shuffle(this.store);
            }
        },
        drawNext: function () {
            this.ctx.fillStyle = "#000";
            this.ctx.strokeStyle = "#000";
            for (var index in this.next) {
                this.ctx.strokeRect(this.next[index].x * 17 + 205, this.next[index].y * 17 + 225, 14, 14);
                this.ctx.fillRect(this.next[index].x * 17 + 207.5, this.next[index].y * 17 + 227.5, 9, 9);
            }
        },
        drawCurrent: function () {
            for (var index in this.current) {
                this.drawRect(this.current[index].x, this.current[index].y, "#000");
            }
        },
        drawMatrix: function () {
            for (var index in this.matrix) {
                this.drawRect(this.matrix[index].x, this.matrix[index].y, "#000");
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
                Array.prototype.push.apply(this.matrix, clone(this.current));
                var y_clear = this.checkClear();
                var _matrix = clone(this.matrix);
                for (var y of y_clear) {
                    for (var index in _matrix) {
                        if (_matrix[index].y < y) {
                            this.matrix[index].y++;
                        } else if (_matrix[index].y === y) {
                            this.matrix.splice(this.matrix.indexOf(_matrix[index]), 1);
                        }
                    }
                }
                // console.log(this.current, this.matrix);
                this.createNext();
                return false;
            } else {
                for (var index in this.current) {
                    this.current[index].y++;
                }
            }
        },
        left: function () {
            this.direction = 0;
            if (this.checkTouch()) {
                return false;
            } else {
                for (var index in this.current) {
                    this.current[index].x--;
                }
            }
        },
        right: function () {
            this.direction = 1;
            if (this.checkTouch()) {
                return false;
            } else {
                for (var index in this.current) {
                    this.current[index].x++;
                }
            }
        },
        rotate: function () {
            var temp = clone(this.current);
            for (var index in this.current) {
                this.current[index].x = temp[0].x - temp[index].y + temp[0].y;
                this.current[index].y = temp[0].y + temp[index].x - temp[0].x;
            }
        },
        checkTouch: function () {
            var flag = false;
            if (this.direction === 0) {
                for (var index in this.current) {
                    if (this.current[index].x - 1 < 0) {
                        return true;
                    }
                }
                if (this.matrix.length === 0) return false;
                outer:
                    for (var index in this.current) {
                        for (var i in this.matrix) {
                            if (this.current[index].x - 1 === this.matrix[i].x && this.current[index].y === this.matrix[i].y) {
                                flag = true;
                                break outer;
                            }
                        }
                    }
            } else if (this.direction === 1) {
                for (var index in this.current) {
                    if (this.current[index].x + 1 > 9) {
                        return true;
                    }
                }
                if (this.matrix.length === 0) return false;
                outer:
                    for (var index in this.current) {
                        for (var i in this.matrix) {
                            if (this.current[index].x + 1 === this.matrix[i].x && this.current[index].y === this.matrix[i].y) {
                                flag = true;
                                break outer;
                            }
                        }
                    }
            } else if (this.direction === 2) {
                for (var index in this.current) {
                    if (this.current[index].y + 1 > 19) {
                        return true;
                    }
                }
                if (this.matrix.length === 0) return false;
                outer:
                    for (var index in this.current) {
                        for (var i in this.matrix) {
                            if (this.current[index].x === this.matrix[i].x && this.current[index].y + 1 === this.matrix[i].y) {
                                flag = true;
                                break outer;
                            }
                        }
                    }
            }
            return flag;
        },
        checkClear: function () {
            // 返回需要清除的行值
            var temp = [];
            var y_clear = [];
            for (var point of this.current) {
                if (temp.indexOf(point.y) === -1) {
                    temp.push(point.y);
                }
            }
            for (var y of temp) {
                var count = 0;
                for (var point of this.matrix) {
                    if (y === point.y) {
                        count++;
                    }
                }
                if (count === 10) {
                    y_clear.push(y);
                }
            }
            return y_clear;
        },
        setInterval: function (fn) {
            var timer = setInterval(function () {
                fn();
            }, 20);
        }
    };

    Tetris.prototype.init.prototype = Tetris.prototype;
    window.Tetris = Tetris;

    // 工具函数
    // 随机返回数组中的一个
    function shuffle(arr, _x = 0, _y = 0) {
        var index = Math.floor(Math.random() * arr.length);
        return clone(arr[index], _x, _y);
    }

    function clone(map, _x = 0, _y = 0) {
        var tempMap = [];
        for (var i in map) {
            var temp = {};
            temp.x = map[i].x + _x;
            temp.y = map[i].y + _y;
            tempMap.push(temp);
        }
        return tempMap;
    }
})(window);