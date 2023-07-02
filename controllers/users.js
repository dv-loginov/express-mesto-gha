const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const ConflictRequest = require('../errors/ConflictRequest');
const BadAuth = require('../errors/BadAuth');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200)
    .send(users));

const getUserById = (req, res, id, next) => User.findById(id)
  .orFail(new NotFound('Пользователь не найден'))
  .then((user) => res.status(200)
    .send(user))
  .catch(next);

const getUser = (req, res, next) => {
  const { id } = req.params;
  return getUserById(req, res, id, next);
};

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  return getUserById(req, res, id, next);
};

const updateUserById = (req, res, next) => {
  const id = req.user._id;
  const dataUpdate = req.body;

  User.findByIdAndUpdate(id, dataUpdate, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((updateUser) => res.status(200)
      .send(updateUser))
    .catch(next);
};

const createUser = (req, res, next) => {
  const newUserData = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      newUserData.password = hash;
      User.create(newUserData)
        .then((newUser) => {
          const user = newUser.toObject();
          delete user.password;
          res.status(201)
            .send(user);
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictRequest());
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new BadAuth('Неверный логин или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new BadAuth('Неверный логин или пароль');

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
            .send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserById,
  login,
  getCurrentUser,
};
