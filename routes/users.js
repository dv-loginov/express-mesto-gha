const router = require('express')
  .Router();
const {
  getUsers,
  getUser,
  updateUserById,
  getCurrentUser,
} = require('../controllers/users');
const {
  getUserValidator,
  updateUserByIdValidator,
  updateUserAvatarValidator,
} = require('../middlewares/validators');

router.get('/me', getCurrentUser);

router.get('/', getUsers);

router.get('/:id', getUserValidator, getUser);

router.patch('/me', updateUserByIdValidator, updateUserById);

router.patch('/me/avatar', updateUserAvatarValidator, updateUserById);

module.exports = router;
