# -*- coding: utf-8 -*
import time
import numpy as np
from os import path
import sys
import os

reload(sys)
sys.setdefaultencoding('utf-8')
__author__ = 'mxq'
LENG = 8565
# LENG = 42


# my_word_vector = []

my_matrix = None


def getAssociationalWordsMatrix(associational_words_path):
    # my_matrix = []
    # with open(associational_words_path) as f:
    #     for line in f:
    #         my_matrix.append(line.strip().split(' '))
    # print sys.getdefaultencoding()
    # my_matrix = np.loadtxt(associational_words_path, dtype = '|S16')
    global my_matrix
    if my_matrix is not None:
        return my_matrix
    my_matrix = np.genfromtxt(associational_words_path, dtype='|S16')
    return my_matrix


def getAssociationalWords(keyword, matrix):
    my_value = []
    my_index = []
    for i in range(LENG):
        if matrix[i][0].strip().strip(':') == keyword:
            for j, elj in enumerate(matrix[i]):
                if j == 1 or j == 3 or j == 5 or j == 7 or j == 9:
                    my_value.append(elj)
                elif j == 2 or j == 4 or j == 6 or j == 8 or j == 10:
                    my_index.append(elj)
    # if matrix[i][0].strip().strip(':') == "引产":
    # for j, elj in enumerate(matrix[i]):
    #	if j > 0:
    #		# print elj
    #		# print str(j-1)
    #		# print str((j-1)/2) + '\n'
    #		my_value.append(elj)
    #		my_index.append(j)
    return my_value, my_index


def getAssociateWords(key):
    associational_words_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'test_associational_words_value.txt')
    associational_words_matrix = getAssociationalWordsMatrix(associational_words_path)
    associational_words_value, associational_words_index = getAssociationalWords(key, associational_words_matrix)
    return associational_words_value, associational_words_index


if __name__ == '__main__':
    start1 = time.clock()
    associational_words_path = 'test_associational_words_value.txt'
    associational_words_matrix = getAssociationalWordsMatrix(associational_words_path)
    start2 = time.clock()
    associational_words_value, associational_words_index = getAssociationalWords("外星人", associational_words_matrix)
    for i, eli in enumerate(associational_words_value):
        print eli
    for i, eli in enumerate(associational_words_index):
        print eli
    elapsed1 = time.clock() - start1
    print(elapsed1)
    elapsed2 = time.clock() - start2
    print(elapsed2)
