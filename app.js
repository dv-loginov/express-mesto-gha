const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const routes = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

async function connectBD(url) {
  await mongoose.connect(url, { useNewUrlParser: true });
}

connectBD(DB_URL)
  .then(() => console.log('Connect BD: Ok'))
  .catch((err) => console.log(err));

app.use(helmet());

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648adefd8dde02e5f10bd736',
  };
  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
