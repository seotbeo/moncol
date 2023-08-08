from PIL import Image
import glob
import re
import os
import math


def round_custom(a):
    t = 0.985
    if a % 1 >= t:
        return (a // 1) + 1
    else:
        return (a // 1)
    
fileList = glob.glob("mob\\*.png")
pat = re.compile(r".+\\(.+)[.][pP][nN][gG]")

try:
    os.mkdir("mob\\fix\\")
except OSError:
    print ("Creation of the directory %s failed" % path)
    
for file in fileList:
    img = Image.open(file).convert("RGBA")
    imgw, imgh = img.size
    if imgw <= 64 and imgh <= 64:
        rvw = 1
        rvh = 1
        imgR = Image.new('RGBA', (imgw, imgh), (0,0,0,0))
    elif imgw > imgh:
        rvw = imgw / 64
        tmp = math.floor((64 * imgh) / imgw)
        rvh = imgh / tmp
        imgR = Image.new('RGBA', (64, tmp), (0,0,0,0))
    else:
        rvh = imgh / 64
        tmp = math.floor((64 * imgw) / imgh)
        rvw = imgw / tmp
        imgR = Image.new('RGBA', (tmp, 64), (0,0,0,0))
        
    for j in range(0, imgR.width):
        for i in range(0, imgR.height):
            imgR.putpixel((j, i), img.getpixel((round_custom(j*rvw),round_custom(i*rvh))))

    fileName = pat.search(file).group(1)
    imgR.save("mob\\fix\\" + fileName + '_fix.png')
    print(fileName)
    img.close()
    imgR.close()

