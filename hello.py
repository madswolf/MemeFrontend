import os
import random
from flask import Flask, redirect, url_for, request, render_template
from werkzeug import secure_filename
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

UPLOAD_FOLDER = 'static'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///memes.db'
#db = SQLAlchemy(app)

#class files(db.model):
#   id = db.column('meme_id',db.Integer, primary_key = True)
#   fileName = db.column('fileName',db.String(100))
#   fileExtension = db.column('fileExtension',db.String(5))
#   data = db.column('data',db.LargeBinary)


def index():
   return render_template('index.html')

def login():
   return render_template('login.html')

def memeForm():
   return render_template('memeForm.html')


app.add_url_rule('/','index',index)
app.add_url_rule('/login', 'login', login)
app.add_url_rule('/submit', 'memeForm', memeForm)

@app.route('/erDuSej/<fuckerName>')
def erDuSej(fuckerName):
   return render_template('userpage.html', fuckerName = fuckerName)

@app.route('/randomMeme')
def randomMeme():
   randomMeme = getRandom()
   if len(randomMeme) == 1:
      print(randomMeme)
      return render_template('randomMeme.html', visual = randomMeme[0])
   else:
      return render_template('randomMeme.html', visual = randomMeme[0], sound = randomMeme[1])

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

@app.route('/upload', methods = ['POST'])
def upload_file():
   vFile = request.files['visualFile']
   sFile = request.files['soundFile']
   
   count = getCount()
   incrementCount(count)

   vFile.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(str(count) + vFile.filename)))
   sFile.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(str(count) + sFile.filename)))

   return 'Din meme sutter nu paa serveren'

def getCount():
   file = open("count.txt", "r")
   count = int(file.readline()) 
   file.close()
   return count

def incrementCount(count):
   file = open("count.txt","w")
   file.write(str(count + 1))
   file.close()

def getRandom():

   id = str(random.randint(0, getCount() - 1))
   dir = os.listdir(UPLOAD_FOLDER + "/")
   filesFound = [name for name in dir if name.startswith(id)]
   amountFound = len(filesFound)
   if (amountFound == 0 or amountFound > 2):
      return ["error.png"]
   else:
      return filesFound

if __name__ == '__main__':
   app.run(host = '0.0.0.0')