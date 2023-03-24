import express from 'express'
import {getFullFilePath} from './utility.js';
import favicon from 'serve-favicon'

const app = express();

app.get('/', (req, res) => {
  res.sendFile(getFullFilePath('calendar.html'));
});

const port = 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});

app.use(favicon(getFullFilePath('favicon.ico')))