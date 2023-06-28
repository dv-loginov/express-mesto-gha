const errors = (err, req, res, next) => {
  console.log(err.statusCode);
  console.log(err.name);
  console.log(err.message);
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  res.status(statusCode).send({ message });
  // if (err.statusCode) {
  //   res.status(err.statusCode).send({ message: err.message });
  // } else {
  //   res.status(500).send({ message: err.message || 'На сервере произошла ошибка' });
  // }
  next();
};

module.exports = errors;
