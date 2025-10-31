// init_db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./demo.db');

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('admin','admin123')");
  db.run("INSERT INTO users (username, password) VALUES ('alice','alicepwd')");

  db.run("DROP TABLE IF EXISTS posts");
  db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, body TEXT)");
  db.run("INSERT INTO posts (title, body) VALUES ('Hello','Welcome to the demo')");
  db.run("INSERT INTO posts (title, body) VALUES ('SQLi','Try search exploit')");
});

db.close(err => {
  if (err) console.error(err);
  else console.log("DB initialized (demo.db)");
});
