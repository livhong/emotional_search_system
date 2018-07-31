
$(document).ready(function () {

});

function drawLine(articles){
    //articles
    var tmpDate = {};
    articles.forEach(function (item) {
        var time = item['date'].split(' ')[0].split(/[^\d+]/).slice(0,3).join('-');
        var positive = item['positive_prob']>item['negative_prob']?1:0;
        var negative = item['positive_prob']>item['negative_prob']?0:1;
        if(tmpDate[time]){
            tmpDate[time].value[0]++;
            tmpDate[time].value[1]+=positive;
            tmpDate[time].value[2]+=negative;
        }else{
            tmpDate[time] = {
                'date': time,
                'value': [1, positive, negative]
            };
        }
    });
    var data = [];
    for(var key in tmpDate){
        data.push(tmpDate[key]);
    }
    data = data.reverse()
    var titles = ['总数', '正面', '负面'];
    // console.log(data);
    generateLine(data, titles);
}

function drawGraph(keywords){
    // keywords = {
    //     'keyword1': ['name11', 'name12', 'name13', 'name14', 'name15'],
    //     'keyword2': ['name21', 'name22', 'name23', 'name24', 'name25']
    // };

    var nodes = [];
    var links = [];
    var categories = [];
    var count=0;
    var m_link = {};
    for(var item in keywords){
        nodes.push(item);
        categories.push(item);
        keywords[item].forEach(function (i) {
            nodes.push(i);
            links.push({
                'source': item,
                'target': i,
                'value': 100
            });
        });
        if(count==0){
            m_link['target'] = item;
        }else{
            m_link['source'] = m_link['target'];
            m_link['target'] = item;
            m_link['value'] = rand(10,20);
            links.push(m_link);
        }
        count++;
    }
    var tmp = {};
    nodes.forEach(function (item) {
        if(tmp[item]){
            tmp[item]['value']++;
        }else{
            tmp[item] = {
                'name': item,
                'value': 1,
                'symbolSize': rand(10, 45),
                'label':{
                    'show': true,
                    'position': 'top'
                },
                'itemStyle':{
                    'color': randColor()
                }
            };
        }
    });
    var finalNodes = [];
    for(var item in tmp){
        finalNodes.push(tmp[item]);
    }

    // 基于准备好的dom，初始化echarts实例

    generateGraph(finalNodes, links, categories);
}

function randColor() {
    var colors = [
        '#79CDCD',
        '#4876FF',
        '#00EEEE',
        '#8B8B00',
        '#8FBC8F',
        '#A52A2A',
        '#B03060',
    ];
    return colors[Math.floor(Math.random()*colors.length)]
}

function rand ( start, end) {
    return ( Math.floor ( Math.random ( ) * (end-start) + start ) );
}

var colors = [
    'black',
    'blue',
    'red'
];

function generateLine(data, titles){
    var series = [];
    for(var i=0;i<titles.length;i++){
        var tmp = function(i) {
            series.push({
                name: titles[i],
                type: 'line',
                data: data.map(function (item) {
                    return item['value'][i];
                }),
                lineStyle:{
                    color: colors[i]
                }
            });
        }(i);
    }
    // console.log(series);
    var lineChart = echarts.init(document.getElementById('line'));
    lineChart.setOption(option = {
        title: {
            text: '文章分布'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: data.map(function (item) {
                return item['date'];
            })
        },
        yAxis: {
            splitLine: {
                show: true
            }
        },
        toolbox: {
            left: 'center',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [{
            startValue: '2014-06-01'
        }, {
            type: 'inside'
        }],
        series: series
    });
}

function generateGraph(nodes, links, categories) {
    var option = {
        title: {
            text: '关键词'
        },
        tooltip: {},
        legend: [{
            // selectedMode: 'single',
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [
            {
                // name: categories.join(','),
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                categories: categories,
                roam: true,
                label: {
                    normal: {
                        position: 'right'
                    }
                },
                force: {
                    repulsion: 100,
                    'edgeLength': 80
                }
            }
        ]
    };
    var graphChart = echarts.init(document.getElementById('main'));
    graphChart.setOption(option);
}

