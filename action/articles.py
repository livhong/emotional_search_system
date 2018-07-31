# -*- coding: utf-8 -*-
import pymongo
from pymongo import MongoClient
import re
import codecs

def search_with_words(word_list,senti_mark):

    client = MongoClient('mongodb://10.141.211.93:27017/')
    das = client.get_database('DAS')
    test = client.get_database('test')
    useless2 = test.get_collection('useless2')
    tmp_s='(?=.*?'
    for word in word_list:
        tmp_s+=word+')(?=.*?'
    tmp_s=tmp_s[0:len(tmp_s)-6]
    # print(tmp_s)
    # tmp_s=+word1+')(?=.*?'+word2+')'
    regx_pattern=r''+tmp_s+r''
    regx = re.compile(regx_pattern, re.IGNORECASE)
    senti = 'negative_prob'
    if senti_mark==0:
        rst = useless2.find(filter={"content": regx, "date": {'$ne': ''}})
    else:
        if senti_mark==-1:
            senti='negative_prob'
        elif senti_mark==1 :
            senti = 'positive_prob'
        rst=useless2.find(filter={"content": regx,"date":{'$ne':''}, senti:{'$gte':0.7}})
    rst.sort("date",pymongo.DESCENDING)
    # print(rst.count())
    return_list = []
    for line in rst:
        # print line['date'].encode('utf-8'),line['title']
        cnt = re.findall(r''+word_list[0]+r'', line['content'])
        # print cnt
        if (len(cnt) >= 2):
            # print(line['date'],line['title'],line[senti],line['content'])
            return_list.append(line)
    client.close()
    print(len(return_list))
    return return_list

if __name__ == '__main__':
    word_list=[u'薛之谦']
    senti=-1
    rst=search_with_words(word_list, senti)
    # with codecs.open('result/'+word_list[0]+str(senti), 'w', 'utf-8') as fd:
    #     fd.write(str(rst))
    # print rst