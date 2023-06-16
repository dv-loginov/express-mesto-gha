const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users));

const getUserById = (req, res) => {
  const { id } = req.params;

  return User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(200).send(user);
  }).catch(() => {
    res.status(500).send({ message: 'Server Error' });
  });
};

const createUser = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUserById = (req, res) => {
  console.log(req.user._id);
  console.log(req.body);
  const id = req.user._id;
  const dataUpdate = req.body;
  User.findByIdAndUpdate(id, dataUpdate, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((updateUser) => res.status(201).send(updateUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  // updateUser,
  // updateUserAvatar,
};
