# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.shortcuts import render
from django.http import HttpResponse

import keywords as key_action
import articles as article_action

def json_res(obj):
    return HttpResponse(json.dumps(obj, ensure_ascii=False), content_type='application/json; charset=utf-8')

# Create your views here.

# {q:"sdf ",p:false,s:["山东富士电梯","sdf 文件","sdf 机场","sdf 字体","松岛枫","史蒂芬周","三定方案","sdf 3ds","sdf 格式","sdf 金融"]}

def keyword_query(request):
    keyword = request.GET.get('q', None)
    keywords, counts = key_action.getAssociateWords(keyword)
    return json_res({
        'q': keyword,
        'p': 'false',
        's': keywords
    })

def keyword_associate(request):
    keywords_str = request.GET.get('q', None)
    keywords = keywords_str.split(',')
    ret = {}
    for k in keywords:
        if k=='':
            continue
        lst, _ = key_action.getAssociateWords(k)
        ret[k] = lst
    return json_res(ret)

def get_articles(request):
    keywords_str = request.GET.get('q', None)
    keywords = keywords_str.split(',')
    senti = request.GET.get('s', '0')
    params = []
    for keyword in keywords:
        if keyword!='':
            params.append(keyword)
    articles = article_action.search_with_words(params, int(senti))
    return json_res(articles)


