const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const setErrors = (res, err) => {
  if (err.message === 'NoValidEmailOrPassword') {
    return res.status(401)
      .send({ message: 'Не верный email или password' });
  }

  if (err.message === 'NoValidId') {
    return res.status(404)
      .send({ message: 'Запрашиваемый пользователь не найден' });
  }

  if (err.name === 'CastError') {
    return res.status(400)
      .send({ message: 'Переданы некорректные данные' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400)
      .send({
        message: `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`,
      });
  }

  return res.status(500)
    .send({ message: 'Ошибка сервера' });
};

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200)
    .send(users));

const getUserById = (req, res, id) => User.findById(id)
  .orFail(new Error('NoValidId'))
  .then((user) => res.status(200)
    .send(user))
  .catch((err) => setErrors(res, err));

const getUser = (req, res) => {
  const { id } = req.params;
  return getUserById(req, res, id);
};

const getCurrentUser = (req, res) => {
  const id = req.user._id;
  return getUserById(req, res, id);
};

const createUser = (req, res) => {
  const newUserData = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      newUserData.password = hash;
      return User.create(newUserData);
    })
    .then((newUser) => res.status(201)
      .send(newUser))
    .catch((err) => setErrors(res, err));
};

const updateUserById = (req, res) => {
  console.log('updateUserById');
  const id = req.user._id;
  const dataUpdate = req.body;
  User.findByIdAndUpdate(id, dataUpdate, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((updateUser) => res.status(200)
      .send(updateUser))
    .catch((err) => setErrors(res, err));
};

const login = (req, res) => {
  console.log('login');
  const {
    email,
    password,
  } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(new Error('NoValidEmailOrPassword'))
    .then((user) => {
      console.log(user);
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new Error('NoValidEmailOrPassword');

          const token = jwt.sign(
            { _id: user._id },
            'some-secret-key',
            { expiresIn: '7d' },
          );

          return res.status(200)
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
            })
            .end();
        })
        .catch((err) => setErrors(res, err));
    })
    .catch((err) => setErrors(res, err));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserById,
  login,
  getCurrentUser,
};
