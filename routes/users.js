const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/me', updateUserById);

router.patch('/me/avatar', updateUserById);

module.exports = router;
