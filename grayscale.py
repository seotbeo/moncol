from PIL import Image
import glob
import re
import os
import math


fileList = glob.glob("mob\\fix\\*.png")
pat = re.compile(r".+\\(.+)[.][pP][nN][gG]")
    
for file in fileList:
    img = Image.open(file).convert("RGBA")
    imgw, imgh = img.size
    
    for j in range(0, imgw):
        for i in range(0, imgh):
            r, g, b, a = img.getpixel((j, i))
            v = int((r + g + b) / 3)
            img.putpixel((j, i), (v, v, v, int(a * 0.4)))
            
    fileName = pat.search(file).group(1)
    img.save("mob\\fix\\gray\\" + fileName + '_grey.png')
    print(fileName)
    img.close()
