const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const debug = require('debug')('app')
const morgan = require('morgan')
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const port = process.env.PORT || 8080
const app = express();
const mongoUrl = `mongodb+srv://f3denver:${process.env.EVENTDBPASSWORD}@events.a1ry0pu.mongodb.net/?retryWrites=true&w=majority`
const apiRouter = require('./src/routers/apiRouter');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'globomantics' }));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/api', apiRouter);

app.get('/status', (req, res) => {
  res.render('status')
});

app.get('/', (req, res) => {
  res.render('calendar', {title: process.env.TITLE, backendLink: process.env.EVENTDBLINK})
});

app.listen(port, () => {
  debug(`helloworld: listening on port ${port}`);
});