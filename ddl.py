
import sqlite3

conn = sqlite3.connect('memes.db')
c = conn.cursor()
conn.execute('drop table if exists toptext;')
conn.execute('drop table if exists bottomtext;')
conn.execute('drop table if exists memevisual;')
conn.execute('drop table if exists memesound;')
conn.execute('drop table if exists memetoptext;')
conn.execute('drop table if exists memebottomtext;')
conn.execute('drop table if exists meme;')

c.execute("""
    CREATE TABLE memevisual(
        id INTEGER PRIMARY KEY,
        fileName CHAR(100)
    );""")

c.execute("""
    CREATE TABLE memesound(
        id INTEGER PRIMARY KEY,
        fileName CHAR(100)
    );""")

c.execute("""
    CREATE TABLE memetoptext(
        id INTEGER PRIMARY KEY,
        memeText CHAR(50)
    );""")

c.execute("""
    CREATE TABLE memebottomtext(
        id INTEGER PRIMARY KEY,
        memeText char(50)
    );""")

c.execute("""
    CREATE TABLE meme(
        id INTEGER PRIMARY KEY,
        visual_id INTEGER,
        sound_id INTEGER,
        topText_id INTEGER,
        bottomText_id INTEGER,
        FOREIGN KEY (visual_id) REFERENCES memevisual (id),
        FOREIGN KEY (sound_id) REFERENCES memesound (id),
        FOREIGN KEY (topText_id) REFERENCES toptext (id),
        FOREIGN KEY (bottomText_id) REFERENCES bottomText (id)
    );""")
