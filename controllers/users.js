const User = require('../models/user');

const setErrors = (res, err) => {
  if (err.message === 'NoValidId') return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });

  if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });

  if (err.name === 'ValidationError') {
    return res.status(400).send({
      message: `${Object.values(err.errors)
        .map((error) => error.message)
        .join(', ')}`,
    });
  }
  return res.status(500).send({ message: 'Ошибка сервера' });
};

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users));

const getUserById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(new Error('NoValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => setErrors(res, err));
};

const createUser = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => setErrors(res, err));
};

const updateUserById = (req, res) => {
  const id = req.user._id;
  const dataUpdate = req.body;
  User.findByIdAndUpdate(id, dataUpdate, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((updateUser) => res.status(200).send(updateUser))
    .catch((err) => setErrors(res, err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
};
