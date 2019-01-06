(function (window) {
    function Jigsaw($cvs,level) {
        return new Jigsaw.prototype.init($cvs,level);
    }

    Jigsaw.prototype = {
        init: function ($cvs,level = 2) {
            this.clear($cvs);
            this.width = $cvs.width();
            this.height = $cvs.height();
            this.cxt = $cvs.get(0).getContext("2d");
            this.length = level;
            this.createSquares();
            this.drawBackground(this.cxt);
            this.addListener($cvs);
        },
        width: 0,
        height: 0,
        length: -1,
        orange:"rgb(230,171,94)",
        blue:"rgb(92,144,255)",
        gray:"rgb(77,77,77)",
        cxt: null,
        squares: [],
        position: [],
        times:0,
        success:null,
        clear:function($cvs){
            $cvs.off("click");
            this.squares = [];
            this.position = [];
        },
        drawBackground: function (cxt) {
            var self = this;
            cxt.fillStyle = this.gray;
            cxt.fillRect(0, 0, this.width, this.height);
            $.each(this.squares, function (index, sq) {
                self.drawRect(cxt, sq, self.orange);
            });
        },
        createSquares: function () {
            var w = this.width / this.length;
            var h = this.height / this.length;
            for (var j = 0; j < this.length; j++) {
                for (var i = 0; i < this.length; i++) {
                    this.squares.push({x0: i * w + 2, y0: j * h + 2, x1: i * w + w - 2, y1: j * h + h - 2});
                    this.position.push([i, j]);
                }
            }
        },
        drawRect: function (cxt, sq, color) {
            cxt.fillStyle = color;
            cxt.fillRect(sq.x0, sq.y0, sq.x1 - sq.x0, sq.y1 - sq.y0);
        },
        getRoundPoints: function (point) {
            var w = this.width / this.length;
            var h = this.height / this.length;
            var roundPoints = [];
            roundPoints.push({x0:point.x0 - w, y0:point.y0, x1:point.x1 - w, y1:point.y1});
            roundPoints.push({x0:point.x0 + w, y0:point.y0, x1:point.x1 + w, y1:point.y1});
            roundPoints.push({x0:point.x0, y0:point.y0 - h, x1:point.x1, y1:point.y1 - h});
            roundPoints.push({x0:point.x0, y0:point.y0 + h, x1:point.x1, y1:point.y1 + h});
            return roundPoints;
        },
        addListener: function ($cvs) {
            var self = this;
            $cvs.on("click", function (event) {
                var p = {x: event.pageX - $cvs.offset().left - 2, y: event.pageY - $cvs.offset().top - 2};
                if(!self.checkPoint(p).point)return false; // 点击了方块外面
                var sqs = self.getRoundPoints(self.checkPoint(p).point);
                sqs.push(self.checkPoint(p).point);
                $.each(sqs,function (index,sq) {
                    var tempColor = self.getColor(sq);
                    if (tempColor === self.orange.replace(/\s/g,'')) {
                        self.drawRect(self.cxt, sq, self.blue);
                    }
                    else if (tempColor === self.blue.replace(/\s/g,'')) {
                        self.drawRect(self.cxt, sq, self.orange);
                    }
                });
                self.times ++;
                self.checkWin();
            });
        },
        checkPoint: function (point) {
            var p = null;
            var i = null;
            $.each(this.squares, function (index, item) {
                if (point.x >= item.x0 && point.x <= item.x1 && point.y >= item.y0 && point.y <= item.y1) {
                    p = item;
                    i = index;
                }
            });
            return {point: p, index: i};
        },
        getColor: function (point) {
            var imagedates = this.cxt.getImageData((point.x0 + point.x1) / 2, (point.y0 + point.y1) / 2, 1, 1);
            var pixel = imagedates.data;
            var color = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
            return color;
        },
        checkWin: function () {
            var flag = true;
            var self = this;
            $.each(this.squares, function (index, point) {
                var tempColor = self.getColor(point);
                if (tempColor !== self.blue) {
                    flag = false;
                }
            });
            if (flag === true) {
                clearTimeout(timer);
                var timer = setTimeout(function () {
                    self.success();
                },0)
            }
        }
    };

    Jigsaw.prototype.init.prototype = Jigsaw.prototype;
    window.Jigsaw = Jigsaw;
})(window);