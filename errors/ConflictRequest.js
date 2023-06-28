class ConflictRequest extends Error {
  constructor(message = 'Переданы некорректные данные') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictRequest;
