const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserById,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.get('/', getUsers);

router.get('/:id', getUser);

router.patch('/me', updateUserById);

router.patch('/me/avatar', updateUserById);

module.exports = router;
