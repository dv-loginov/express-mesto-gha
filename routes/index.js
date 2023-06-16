const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
// const timeLoggerMiddleware = require('../middlewares/timeLogger');

// respond with "hello world" when a GET request is made to the homepage
router.get('/', (req, res) => {
  res.send('Server is run');
});

router.use('/users', userRoutes);
// router.use('/profiles', timeLoggerMiddleware);
// router.use('/profiles', userRoutes);
router.use('/cards', cardRoutes);

// router.get('*', (req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });
//
// router.get('*', (req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });
//
// router.get('*', (req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });

module.exports = router;
