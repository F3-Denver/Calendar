const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const debug = require('debug')('app')
const morgan = require('morgan')

const port = process.env.PORT || 8080
const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/status', (req, res) => {
  res.render('status')
});

app.get('/', (req, res) => {
  res.render('calendar', {title: process.env.TITLE, editMode: false})
});

app.get('/edit', (req, res) => {
  res.render('calendar', {title: 'Calendar Editor', editMode: true})
});

app.listen(port, () => {
  debug(`helloworld: listening on port ${port}`);
});