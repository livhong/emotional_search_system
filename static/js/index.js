String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

String.format = function () {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

$(document).ready(function () {

    var pageSize = 6;
    var input = $('#input');
    $("#keyword-search-btn").click(function(){
        var txt = input.val();
        if(txt&&txt.trim()!=''){
            $.ajax({
                url: '/action/keywords/associate?q='+txt.split(' ').join(','),
                type: 'GET',
                dataType: "json",
                success: function(json) {
                    $('#main').removeClass('hidden');
                    // console.log(json)
                    drawGraph(json);
                }
            });
            $.ajax({
                url: '/action/keywords/articles?q='+txt.split(' ').join(',')+'&s='+$('#senti-input').val(),
                type: 'GET',
                dataType: "json",
                success: function(json) {
                    if(json.length==0){
                        $('#line').addClass('hidden');
                        $('#article-panel').addClass('hidden');
                        $('.page').addClass('hidden');
                        return;
                    }
                    $('#line').removeClass('hidden');
                    $('#article-panel').removeClass('hidden');
                    $('.page').removeClass('hidden');
                    drawLine(json);
                    generateArticlesPanel(json.slice(0, pageSize));
                    var page = $(".page").CustomPage({
                        pageSize: pageSize,
                        count: json.length,
                        current: 1,
                        callback: function(i){
                            generateArticlesPanel(json.slice((i-1)*pageSize, i*pageSize));
                        }
                    });
                }
            });
        }
    });

});

function generateArticlesPanel(articles){
    var panel = $('#article-panel');
    panel.html('');
    var lastTime;
    var count = 0;
    for(var i=0;i<articles.length;i++){
        var item = articles[i];
        time = item['date'].split(' ')[0].split(/[^\d+]/).slice(0,2).join('-');
        if(time!=lastTime){
            panel.html(panel.html()+generateTimeDiv(time));
            lastTime = time;
        }
        var senti = item['positive_prob']>item['negative_prob']?'positive':'negative';
        if(count%2==0){
            panel.html(panel.html()+generateTimelinePanel(item['title'], item['date'], item['content'].slice(0, 40)+'......', '', senti));
        }else{
            panel.html(panel.html()+generateTimelineRevertedPanel(item['title'], item['date'], item['content'].slice(0, 40)+'......', '', senti));
        }
        count++;
    }


}

function generateTimeDiv(time){
    return '<li><div class="tldate">{0}</div></li>'.format(time)
}

function generateTimelinePanel(title, time, content, image, senti){
    return ('        <li><div class="{4}">\n' +
        '          <div class="tl-circ"></div>\n' +
        '          <div class="timeline-panel">\n' +
        '            <div class="tl-heading">\n' +
        '              <h4>{0}</h4>\n' +
        '              <p><small class="text-muted"><i class="glyphicon glyphicon-time"></i> {1}</small></p>\n' +
        '            </div>\n' +
        '            <div class="tl-body">\n' +
        '              <p>{2}</p>\n' +
        // '            <p><img src="{3}" alt="lorem pixel"></p>' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div></li>').format(title, time, content, image, senti)
}

function generateTimelineRevertedPanel(title, time, content, image, senti){
    return ('<li class="timeline-inverted"><div class="{4}">\n' +
        '          <div class="timeline-panel">\n' +
        '            <div class="tl-heading">\n' +
        '              <h4>{0}</h4>\n' +
        '              <p><small class="text-muted"><i class="glyphicon glyphicon-time"></i> {1}</small></p>\n' +
        '            </div>\n' +
        '            <div class="tl-body">\n' +
        '              <p>{2}</p>\n' +
        '\n' +
        // '              <p><img src="{3}" alt="lorem pixel"></p>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div></li>').format(title, time, content, image, senti)
}

