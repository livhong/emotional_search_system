$(document).ready(function() {

    $('#senti-list a').click(function(){
        // console.log($(this).data('value'));
        $('#senti-input').val($(this).data('value'));
        $('#senti-btn').html($(this).html().trim()+'<span class="caret"></span>');
    });

    /*--------------------搜索框样式控制js------------------------*/
    var checktype = $("#search_bg #button_bg .changetype");
    var type = $("#search_bg #button_bg .seach_type .type");
    var form = $("#search_bg #button_bg form");
    var textb = $("#input");
    var subb = $("#search_bg #button_bg  .subb");
    var tbcolor = "#126AC1";
    textb.focus(); //文档加载完毕 搜索框获取焦点
    var search_types = {};

    type.click(function() {
        form.attr("action", search_types.types[$(this).index()].action); //改变表单提交位置
        textb.attr("name", search_types.types[$(this).index()].name); //改变表单变量名
        subb.val(search_types.types[$(this).index()].value); //改变按钮显示
        subb.css({ background: search_types.types[$(this).index()].subcolor }); //改变按钮颜色
        tbcolor = search_types.types[$(this).index()].subcolor; //改变输入框边框颜色
        checktype.css({ "background": "url(" + search_types.types[$(this).index()].stype + ")" });
        subb.css({ "box-shadow": "0 1px 2px " + search_types.types[$(this).index()].subcolor });
        textb.focus(); //编辑框获取焦点
    });

    textb.focus(function() {
        textb.css({ border: "solid 1px " + tbcolor });
    });
    textb.blur(function() {
        textb.css({ border: "solid 1px " + "#CCCCCC" });
    });
    /*-----------------获取关键词js---------------------*/
    var textb = $("#search_bg #button_bg #input");
    
    
    
    textb.keyup(function(event) {
        if (textb.val() == "" || textb.val() == " ") {
            return;
        }
        if (event.which == 32)
            $.ajax({
                url: "/action/keywords/search?q="+textb.val(),
                type: "GET",
                dataType: "json",
                async: false,
                timeout: 5000, //请求超时
                success: function(json) {
                    keydata(json)
                },
                error: function(xhr) {
                    return;
                }

            });
    });

});
//打印关键词
function keydata(keys) {
    var len = keys.s.length;
    var keywordbox = $("#search_bg #button_bg .keyword"); //关键词盒子
    var textb = $("#search_bg #button_bg #input");
    var subb = $("#search_bg #button_bg .subb");
    if (len == 0) {
        keywordbox.css({ display: "none" });
    } else {
        keywordbox.css({ display: "block" });
    }
    var spans = "";
    for (var i = 0; i < len; i++) {
        spans += "<span>" + textb.val().trim()+' '+keys.s[i] + "</span>"
    }
    keywordbox.html(spans); //把关键词写入关键词盒子
    keywordbox.animate({
        height: (keywordbox.children().height() + 1) * len //关键词下滑效果
    }, 100);
    //点击候选词汇
    keywordbox.children().click(function() {
        textb.val($(this).html()); //选中词汇放入输入框

        keywordbox.animate({
            height: 0 //关键盒子收缩效果
        }, 10, function() {
            keywordbox.css({ display: "none", height: "auto" });
            keywordbox.empty(); //清空盒子内容
        });

        textb.focus(); //输入框获取焦点*/
        // $("#search_bg #button_bg form").submit(); //提交搜索
    });

    //提交按钮获取焦点后
    subb.focus(function() { //提交按钮获取焦点后
        keywordbox.animate({
            height: 0 //关键盒子收缩效果
        }, 10, function() {
            keywordbox.css({ display: "none", height: "auto" });
            keywordbox.empty(); //清空盒子内容
        });
    });
    keywordbox.mouseleave(function() { //鼠标离开关键字盒子后收缩关键词盒子（取代上一个方法）
        keywordbox.animate({
            height: 0 //关键盒子收缩效果
        }, 100, function() {
            keywordbox.css({ display: "none", height: "auto" });
            keywordbox.empty(); //清空盒子内容
        });
    });
    var numspan = 0; //用来指定选择候选词（通过方向键改变）
    textb.keydown(function(event) { //如果使用回车提交时，关键词盒子也可以自动收缩
        if (event.which == 13) {
            keywordbox.animate({
                height: 0 //关键盒子收缩效果
            }, 10, function() {
                keywordbox.css({ display: "none", height: "auto" });
                keywordbox.empty(); //清空盒子内容
            });
        }
        //按下下方向键
        if (event.which == 40) {

            if (numspan == len)
                numspan = 0;
            for (var i = 0; i < len; i++) {
                if (numspan == i) {
                    keywordbox.children().eq(i).css({
                        "background-color": "rgba(0,0,0,0.3)"
                    });
                } else {
                    keywordbox.children().eq(i).css({
                        "background-color": "rgba(255,255,255,0.3)"
                    });
                }
            }
            textb.val(keywordbox.children().eq(numspan).html());
            numspan++;
        }
        //按下上方向键
        if (event.which == 38) {

            numspan--;
            if (numspan == len)
                numspan = 0;
            for (var i = 0; i < len; i++) {
                if (numspan == i) {
                    keywordbox.children().eq(i).css({
                        "background-color": "rgba(0,0,0,0.3)"
                    });
                } else {
                    keywordbox.children().eq(i).css({
                        "background-color": "rgba(255,255,255,0.3)"
                    });
                }
            }
            textb.val(keywordbox.children().eq(numspan).html());

        }
    });
    // keywordbox.children().click(function() {//mouseover
    //     console.log("sdfsffsdfsdfsdsfsdfsfsdfsdfsfsdfsdfsdfsdfs");
    //     numspan = $(this).index();
    //     textb.val(keywordbox.children().eq(numspan).html());
    // });

}
