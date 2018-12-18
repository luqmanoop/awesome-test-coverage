const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const appRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

app.get(['/', '/api'], (req, res) =>
  res.send({
    greet: 'Saluton Mundo!',
    msg: 'Welcome to the best Cats 😺 API on the internet.'
  })
);
app.use('/api', appRouter);

app.listen(PORT);

module.exports = app;
