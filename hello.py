import os
import subprocess
import random
import sqlite3
from flask import Flask, redirect, url_for, request, render_template
from PIL import Image
from io import BytesIO
from pygifsicle import optimize
from werkzeug import secure_filename
import base64


app = Flask(__name__)



UPLOAD_FOLDER = 'static'
SOUNDFILE_FOLDER = 'soundfiles'
VISUALFILE_FOLDER = 'visualfiles'

SOUNDFILE_TABLE_NAME = 'memesound'
VISUALFILE_TABLE_NAME ='memevisual'
TOPTEXT_TABLE_NAME = 'memetoptext'
BOTTOMTEXT_TABLE_NAME = 'memebottomtext'

CHANCE_OF_SOUND = 50
CHANCE_OF_TOPTEXT = 25
chance_OF_BOTTOMTEXT = 25
FILENAME_MAX_LENGTH = 100
MEMETEXT_MAX_LENGTH = 50

DATABASE_NAME = 'memes.db'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
   
def index():
   return render_template('index.html')

def login():
   return render_template('login.html')

def memeForm():
   return render_template('memeform.html')

def deathRoll():
   return render_template('deathRolling.html')

app.add_url_rule('/','index',index)
app.add_url_rule('/login', 'login', login)
app.add_url_rule('/submit', 'memeForm', memeForm)
app.add_url_rule('/deathRoll','deathRoll',deathRoll)

@app.route('/erDuSej/<fuckerName>')
def erDuSej(fuckerName):
   return render_template('userpage.html', fuckerName = fuckerName)

@app.route('/randomMeme')
def randomMeme():
   return render_template('randomMeme.html')
   
@app.route('/requestMeme')
def memeRequest():
   memes = getRandom() 

   result = memes["visualFile"].split('.')[-1] + "___" + readFileAsBase64(memes["visualFile"],VISUALFILE_FOLDER)
   print(memes["visualFile"])
   if 'soundFile' in memes:
      result = result + "@@@" + memes["soundFile"].split('.')[-1] + "___" + readFileAsBase64(memes["soundFile"],SOUNDFILE_FOLDER)
   if 'topText' in memes:
      result = result + "@@@" + memes["topText"]
   if 'bottomText' in memes:
      result = result + "@@@" + memes["bottomText"]

   return result

@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name

@app.route('/erDuSej_request',methods = ['POST','GET'])
def erDuSej_request():
   if request.method == 'POST':
      user = request.form['nm']
      return redirect(url_for('erDuSej',fuckerName = user))
   else:
      user = request.args.get('nm')
      return redirect(url_for('erDuSej',fuckerName = user))

@app.route('/login_request',methods = ['POST', 'GET'])
def login_request():
   if request.method == 'POST':
      user = request.form['nm']
      return redirect(url_for('success',name = user))
   else:
      user = request.args.get('nm')
      return redirect(url_for('success',name = user))

def addAndSaveMemeFile(conn,tableName, folder, file):
   fileName = secure_filename(file.filename)   
   fileName, extension = os.path.splitext(fileName)
   if (len(fileName) > FILENAME_MAX_LENGTH):
      fileName = fileName[0:FILENAME_MAX_LENGTH]
   fileLocation = os.path.join(app.config['UPLOAD_FOLDER'], folder, (fileName + extension))

   file.save(fileLocation)

   if ((extension == ".jpg") | (extension == ".png") | (extension == ".jpeg")):
      image = Image.open(fileLocation)
      image = image.resize((400,400),Image.ANTIALIAS)
      image.save(fileLocation,optimize=True,quality=85)
   elif (extension == ".gif"):
      optimize(fileLocation)
   elif(extension == ".mp4"):
      print("ffmpeg -i " + fileLocation + " -vcodec h264 -acodec mp2 " + fileLocation)
      fileName = fileName + "comp"
      compressedFileLocation = os.path.join(app.config['UPLOAD_FOLDER'], folder,(fileName + extension))
      #the compressed file needs a different name than the original since ffmpeg can't work in-place
      subprocess.run("ffmpeg -i " + fileLocation + " -vcodec h264 -acodec mp2 " + compressedFileLocation,shell=True)
      subprocess.run("rm " + fileLocation,shell=True)
      fileLocation = compressedFileLocation
   

   c = conn.execute("""
      INSERT INTO {}
      VALUES(?,?)
   """.format(tableName),(None,(fileName + extension)))
   print("inserted" + fileName + extension + "into" + tableName + "with id" + str(c.lastrowid))

   return c.lastrowid

def addMemeText(conn,text,tableName): 
   if (len(text) > MEMETEXT_MAX_LENGTH):
      text = text[0:MEMETEXT_MAX_LENGTH]
   c = conn.execute("""
      INSERT INTO {}
      VALUES(?,?)
   """.format(tableName),(None,text))
   print("inserted" + text + "as" + text + "with id" + str(c.lastrowid))
   return c.lastrowid

@app.route('/upload', methods = ['POST'])
def upload_file():
   conn = sqlite3.connect(DATABASE_NAME)
   soundID = topTextID = bottomTextID = "NULL"

   if 'soundFile' in request.files:
      sFile = request.files['soundFile']
      soundID = addAndSaveMemeFile(conn,SOUNDFILE_TABLE_NAME, SOUNDFILE_FOLDER, sFile)

   if 'topText' in request.form:
      topTextID = addMemeText(conn,request.form['topText'],TOPTEXT_TABLE_NAME)

   if 'bottomText' in request.form:
      bottomTextID = addMemeText(conn,request.form['bottomText'],BOTTOMTEXT_TABLE_NAME)

   vFile = request.files['visualFile']
   visualID = addAndSaveMemeFile(conn,VISUALFILE_TABLE_NAME,VISUALFILE_FOLDER, vFile)

   c = conn.execute("""
      INSERT INTO meme
      VALUES(?,?,?,?,?)
   """,(None,visualID,soundID,topTextID,bottomTextID))
   print("inserted meme into meme table with id" + str(c.lastrowid))
   conn.commit()
   conn.close()

   return 'Din meme sutter nu paa serveren'

def readFileAsBase64(fileName, folder):
   fileName, extension = os.path.splitext(fileName)
   if ((extension == ".jpg" )| (extension == ".png") | (extension == ".jpeg")):
      file = Image.open(UPLOAD_FOLDER + '/' + folder + '/' + fileName + extension)
      im_file = BytesIO()
      if ((extension == ".jpg") | (extension == ".jpeg")):
         imageFormat = "JPEG"
      else:
         imageFormat = "PNG"
      file.save(im_file, format=imageFormat)
      based64 = base64.b64encode(im_file.getvalue())
   elif((extension == ".mp3")| (extension == ".mp4")):
      file = open(UPLOAD_FOLDER + '/' + folder + '/' + fileName + extension,"rb")
      based64 = base64.b64encode(file.read())
   else:
      file = open(UPLOAD_FOLDER + '/' + folder + '/' + fileName + extension)
      based64 = base64.b64encode(file.read())

   file.close()
   return str(based64)

def getRandomComponentFromTable(conn,table,fieldName):
   c = conn.cursor()
   print(table)
   print(fieldName)
   c.execute("SELECT COUNT(*) FROM {}".format(table))
   randID = random.randint(1, int(c.fetchone()[0]))
   print("HERE -----------> " + str(randID) + "<----------------" + table)
   c.execute("SELECT {} FROM {} where id=?".format(fieldName,table),(randID,))
   fileName = c.fetchone()[0]
   return fileName

def getRandom():

   conn = sqlite3.connect(DATABASE_NAME)

   visualFile = getRandomComponentFromTable(conn,VISUALFILE_TABLE_NAME,"fileName")
   
   if random.randint(0,100) < CHANCE_OF_SOUND:
      soundFile = getRandomComponentFromTable(conn,SOUNDFILE_TABLE_NAME,"fileName")
   if random.randint(0,100) < CHANCE_OF_TOPTEXT:
      topText = getRandomComponentFromTable(conn,TOPTEXT_TABLE_NAME,"memeText")
   if random.randint(0,100) < chance_OF_BOTTOMTEXT:
      bottomText = getRandomComponentFromTable(conn,BOTTOMTEXT_TABLE_NAME, "memeText")

   components = {}
   print(visualFile)
   if visualFile is not None:
      print("was in locals")
      components["visualFile"] = visualFile
   else:
      components["visualFile"] = "error.png"
   if "soundFile" in locals():
      components["soundFile"] = soundFile
   if "topText" in locals():
      components["topText"] = topText
   if "bottomText" in locals():
      components["bottomText"] = bottomText

   conn.close()

   return components

if __name__ == '__main__':
   app.run(host = '0.0.0.0',port = 80,debug = True)