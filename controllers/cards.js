const Card = require('../models/card');

const setErrors = (res, err) => {
  if (err.message === 'NoValidId') return res.status(404).send({ message: 'Запрашиваемый id не найден' });

  if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });

  if (err.name === 'ValidationError') {
    return res.status(400).send({
      message: `${Object.values(err.errors)
        .map((error) => error.message)
        .join(', ')}`,
    });
  }
  return res.status(500).send({ message: 'Ошибка сервера' });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => {
    res.status(500).send({ message: 'Ошибка сервера' });
  });

const createCard = (req, res) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  return Card.create(newCardData)
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => setErrors(res, err));
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(new Error('NoValidId'))
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        return Card.deleteOne({ _id: id })
          .then(() => res.status(200).send({ message: `Карточка ${id} удалена` }))
          .catch((err) => setErrors(res, err));
      }
      return res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
    })
    .catch((err) => setErrors(res, err));
};

const likeCard = (req, res) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('NoValidId'))
  .then((newCard) => res.status(200).send(newCard))
  .catch((err) => setErrors(res, err));

const dislikeCard = (req, res) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('NoValidId'))
  .then((newCard) => res.status(200).send(newCard))
  .catch((err) => setErrors(res, err));

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
