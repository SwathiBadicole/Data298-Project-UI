import tkinter as tk
from tkinter import filedialog
from tkinter import *
from PIL import ImageTk, Image
import numpy
from tensorflow import keras
#import tensorflow as tf
#from tensorflow.keras import load_model
#import torch
model = keras.models.load_model('final_CNN_model.hdf5')

#dictionary to label all traffic signs class.
classes = { 
9:'C+EL',
20:'ER+S',
29:'D+ER+L',
37:'D+L+ER+S',
10:'C+ER',
38:'Normal',
30:'D+ER+S',
0:'Center',
11:'C+L',
21:'L+S',
31:'D+L+S',
1:'Donut',
12:'C+S',
22:'C+EL+L',
32:'EL+L+S',
2:'Edge-Loc',
13:'D+EL',
23:'C+EL+S',
33:'ER+L+S',
3:'Edge-Ring',
14:'D+ER',
24:'C+ER+L',
34:'C+L+EL+S',
4:'Loc',
15:'D+L',
25:'C+ER+S',
35:'C+L+ER+S',
5:'Random',
16:'D+S',
26:'C+L+S',
36:'D+L+EL+S',
6:'Scratch',
17:'EL+L',
27:'D+EL+L',
19:'ER+L',
7:'Near-full',
18:'EL+S',
28:'D+EL+S',
8:'none'}


def predict_image(img):
    print(img)
    img_4d=img.reshape(-1,52,52,3)
    pred  = model.predict(img_4d)
    img_4d = numpy.argmax(pred,axis=1)
    pred=pred.flatten()
    #print({classes[i]: float(pred[i]) for i in range(38)})
    #return classes[int(img_4d)+1]
    return {classes[i]: float(pred[i]) for i in range(38)}

