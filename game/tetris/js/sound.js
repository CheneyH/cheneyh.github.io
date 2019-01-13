(function (window) {
    function Sound(src) {
        return new Sound.prototype.init(src);
    }

    Sound.prototype = {
        init: function (src) {
            this.audio = new Audio(src);
            this.audio.volume = 0;
        },
        playTimer:null,
        audio: null,
        lastRunTime:0,
        playClear: function () {
            clearTimeout(this.playTimer);
            if(this.checkProtect()){
                return;
            }
            var self = this;
            this.audio.currentTime = 0;
            this.audio.play();
            this.playTimer = setTimeout(function () {
                self.audio.pause();
            }, 1000);
        },
        playDrop: function () {
            clearTimeout(this.playTimer);
            if(this.checkProtect()){
                return;
            }
            var self = this;
            var timer = null;
            this.audio.currentTime = 1;
            this.audio.play();
            this.playTimer = setTimeout(function () {
                self.audio.pause();
            }, 1000);
        },
        playRotate: function () {
            clearTimeout(this.playTimer);
            if(this.checkProtect()){
                return;
            }
            var self = this;
            this.audio.currentTime = 2;
            this.audio.play();
            this.playTimer = setTimeout(function () {
                self.audio.pause();
            }, 800);
        },
        playMove: function () {
            clearTimeout(this.playTimer);
            if(this.checkProtect()){
                return;
            }
            var self = this;
            this.audio.currentTime = 2.8;
            this.audio.play();
            this.playTimer = setTimeout(function () {
                self.audio.pause();
            }, 800);
        },
        playStart: function () {
            clearTimeout(this.playTimer);
            if(this.checkProtect()){
                return;
            }
            var self = this;
            this.audio.currentTime = 3.3;
            this.audio.play();
            this.playTimer = setTimeout(function () {
                self.audio.pause();
            }, 4000);
        },
        playFail: function () {
            clearTimeout(this.playTimer);
            if(this.checkProtect()){
                return;
            }
            var self = this;
            this.audio.currentTime = 8;
            this.audio.play();
            this.playTimer = setTimeout(function () {
                self.audio.pause();
            }, 1500);
        },
        checkProtect:function () {
            var currentTime = Date.now();
            if(currentTime - this.lastRunTime < 100){
                this.lastRunTime = currentTime;
                return true;
            }
            this.lastRunTime = currentTime;
            return false;
        }
    };

    Sound.prototype.init.prototype = Sound.prototype;
    window.Sound = Sound;
})(window);