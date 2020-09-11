import os
import subprocess
from os import listdir
from os.path import isfile,join
from PIL import Image
from pygifsicle import optimize

uploadFolder = input()

for fileName in listdir(uploadFolder):
    print(fileName)
    if isfile(fileName):
        fileName, extension = os.path.splitext(fileName)
        fileLocation = os.path.join(uploadFolder,(fileName + extension))
        if (extension == ".jpg" | extension == ".png" | extension == ".jpeg"):
            image = Image.open(fileLocation)
            image = image.resize((400,400),Image.ANTIALIAS)
            image.save(fileLocation,optimize=True,quality=85)
        elif (extension == ".gif"):
            optimize(fileLocation)
        elif(extension == ".mp4"):
            subprocess.run("ffmpeg -i " + fileLocation + "-vcodec h264 -acodec mp2 " + os.path.join(uploadFolder,(fileName + "comp" + extension),shell=True)
