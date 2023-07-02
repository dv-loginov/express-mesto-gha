const router = require('express')
  .Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFound = require('../errors/NotFound');
const {
  loginValidator,
  createUserValidator,
} = require('../middlewares/validators');
const {
  login,
  createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', loginValidator, login);

router.post('/signup', createUserValidator, createUser);

router.get('/', (req, res) => {
  res.send('Server is run');
});

router.use(auth);

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
