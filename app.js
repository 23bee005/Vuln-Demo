// app.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const _ = require('lodash');

const app = express();
const db = new sqlite3.Database('./demo.db');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'hardcoded_secret',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false }
}));

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user || null, msg: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const q = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  db.get(q, (err, row) => {
    if (err) return res.render('index', { user: null, msg: 'DB error' });
    if (row) {
      req.session.user = row.username;
      res.cookie('user', row.username, { httpOnly: false });
      return res.redirect('/');
    } else {
      return res.render('index', { user: null, msg: 'Invalid credentials' });
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.clearCookie('user') && res.redirect('/'));
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const sql = `SELECT * FROM posts WHERE title LIKE '%${q}%' OR body LIKE '%${q}%'`;
  db.all(sql, (err, rows) => {
    if (err) return res.send("DB error");
    res.render('search', { q, results: rows });
  });
});

app.post('/comment', (req, res) => {
  const { comment } = req.body;
  res.send(`<h3>Your comment was posted:</h3><div>${comment}</div><a href="/">Back</a>`);
});

app.get('/admin', (req, res) => {
  const config = { role: 'user' };
  const ext = req.query.ext || '{}';
  let parsed;
  try { parsed = JSON.parse(ext); } catch (e) { parsed = {}; }
  const merged = _.merge({}, config, parsed);
  res.send(`Merged config: <pre>${JSON.stringify(merged, null, 2)}</pre>`);
});

app.listen(3000, () => console.log('Vuln demo app running on http://localhost:3000'));
