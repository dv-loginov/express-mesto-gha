const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  login,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/signin', login);

router.post('/signup', createUser);

router.patch('/me', updateUserById);

router.patch('/me/avatar', updateUserById);

module.exports = router;
