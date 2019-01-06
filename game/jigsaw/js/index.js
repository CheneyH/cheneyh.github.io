$(function () {
    var $cvs = $("canvas");
    var level = window.location.hash.slice(1) || 2;
    var jigsaw;
    initEvent();
    initJigsaw();

    function initEvent() {
        $(".last-level").on("click",function () {
            level--;
            if(level < 2){
                level = 2;
                alert("到底啦");
            }
            initJigsaw();
            window.location.hash = level;
        });

        $(".next-level").on("click",function () {
            level++;
            if(level > 15){
                level = 15;
                alert("到顶啦");
            }
            initJigsaw();
            window.location.hash = level;
        })
    }

    function initJigsaw() {
        jigsaw = new Jigsaw($cvs,level);
        jigsaw.success = function(){
            alert("恭喜通过");
            $(".next-level").trigger("click");
        };
    }
});