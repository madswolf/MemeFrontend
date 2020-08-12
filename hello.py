import os
from flask import Flask, redirect, url_for, request, render_template
from werkzeug import secure_filename
app = Flask(__name__)

UPLOAD_FOLDER = 'uploads/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def login():
   return render_template('login.html')

def index(fuckerName):
   return render_template('userpage.html', fuckerName = fuckerName)

def memeForm():
   return render_template('memeForm.html')

app.add_url_rule('/<fuckerName>', 'index', index)
app.add_url_rule('/', 'login', login)
app.add_url_rule('/submit', 'memeForm', memeForm)

@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name


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

   vFile.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(vFile.filename)))
   sFile.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(sFile.filename)))

   return 'Din meme sutter nu paa serveren'

if __name__ == '__main__':
   app.run(host = '0.0.0.0')