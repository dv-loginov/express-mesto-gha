const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFound = require('../errors/NotFound');

router.get('/', (req, res) => {
  res.send('Server is run');
});

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
