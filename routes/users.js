const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);

router.get('/:id', auth, getUserById);

router.post('/signin', login);

router.post('/signup', createUser);

router.patch('/me', auth, updateUserById);

router.patch('/me/avatar', auth, updateUserById);

module.exports = router;
