const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const routes = require('./routes/index');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  errors,
  celebrate,
  Joi,
} = require('celebrate');
const errorsApi = require('./middlewares/errorsApi');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/mestodb'
} = process.env;
const app = express();

async function connectBD(url) {
  await mongoose.connect(url, { useNewUrlParser: true });
}

connectBD(DB_URL)
  .then(() => console.log('Connect BD: Ok'))
  .catch((err) => console.log(err));

app.use(helmet());

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email(),
      password: Joi.string()
        .min(8),
    }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(/https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/),
      email: Joi.string()
        .email(),
      password: Joi.string()
        .min(8),
    }),
}), createUser);

app.use(auth);

app.use(routes);

app.use(errors());

app.use(errorsApi);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
