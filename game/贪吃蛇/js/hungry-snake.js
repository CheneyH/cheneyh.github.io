/**
 * Created by Cheney on 2018/12/28.
 */
(function (window) {
    function Snake(mapW, mapH) {
        return new Snake.prototype.init(mapW, mapH);
    }

    Snake.prototype = {
        init: function (mapW, mapH) {
            clearInterval(self.snakeTimer);
            this.food = [];
            this.body = [];
            this.position = [];
            this.path = [];
            this.alive = true;
            this.length = 0;
            this.mapW = mapW;
            this.mapH = mapH;
            this.position.push([Math.floor(Math.random() * (mapW - 2) + 1), Math.floor(Math.random() * (mapH - 2) + 1)]);
            this.body.push(this.position[0][1] * mapW + this.position[0][0]);
            this.direction = Math.floor(Math.random() * 4);
            this.path.push(this.direction);
            this.foodNum = Math.floor(mapW * mapH / 300);
            this.createFood();
        },
        createFood: function () {
            var tempFood;
            while (1) {
                tempFood = Math.floor(Math.random() * (this.mapW * this.mapH));
                if (this.body.indexOf(tempFood) !== -1 || this.food.indexOf(tempFood) !== -1) {
                    tempFood = Math.floor(Math.random() * (this.mapW * this.mapH));
                } else {
                    this.food.push(tempFood);
                    if (this.food.length === this.foodNum)
                        break;
                }
            }
        },
        mapW: 0,
        mapH: 0,
        length: 0,
        paused: true,
        body: [],
        speed: 1,
        position: [],
        food: [],
        foodNum: 3,
        alive: true,
        direction: 0,
        path: [],
        snakeTimer: null,
        move: function (speed, callback, over) {
            var self = this;
            this.snakeTimer = setInterval(function () {
                if (self.paused) return false;
                self.path.unshift(self.direction);
                switch (self.direction) {
                    case 0: // right
                        self.position.unshift([self.position[0][0] + 1, self.position[0][1]]);
                        break;
                    case 1: // up
                        self.position.unshift([self.position[0][0], self.position[0][1] - 1]);
                        break;
                    case 2: // left
                        self.position.unshift([self.position[0][0] - 1, self.position[0][1]]);
                        break;
                    case 3: // down
                        self.position.unshift([self.position[0][0], self.position[0][1] + 1]);
                        break;
                }

                self.body.unshift(self.position[0][1] * self.mapW + self.position[0][0]);

                // 撞到墙壁
                if (self.position[0][0] < 0 || self.position[0][1] < 0 || self.position[0][0] >= self.mapW || self.position[0][1] >= self.mapH) {
                    self.alive = false;
                }

                // 撞到身体
                if (self.body.slice(1).indexOf(self.body[0]) !== -1) {
                    self.alive = false;
                }

                // 吃东西
                var indexOfFood = self.food.indexOf(self.body[0]);
                console.log(indexOfFood, self.food);
                if (indexOfFood === -1) {
                    self.position.pop();
                    self.body.pop();
                    self.path.pop();
                } else {
                    self.food.splice(indexOfFood, 1);
                    self.createFood();
                    self.length++;
                }

                // 判断是否死亡
                if (!self.alive) {
                    clearInterval(self.snakeTimer);
                    over();
                } else {
                    callback();
                }

                console.log(speed);
            }, 500 - 40 * speed);
        }
    };

    Snake.prototype.init.prototype = Snake.prototype;
    window.Snake = Snake;
})(window);