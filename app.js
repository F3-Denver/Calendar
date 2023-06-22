const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const debug = require('debug')('app')
const morgan = require('morgan')

// Custom variables
const title = "F3 Denver Calendar"
const linkToEventDatabase = "https://docs.google.com/spreadsheets/d/1sLq5aMdx9sCQXxVh0gzZMj_pywDeh_E6U1f18FObAvQ/edit"
const port = 8080

const app = express()
const apiRouter = require('./src/routers/apiRouter')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/api', apiRouter);

app.get('/status', (req, res) => {
  res.render('status')
});

app.get('/', (req, res) => {
  res.render('calendar', {title: title, backendLink: linkToEventDatabase})
});

app.listen(port, () => {
  debug(`listening on port ${port}`);
});