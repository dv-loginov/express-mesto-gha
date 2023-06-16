const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Ошибка сервера' });
  });

const createCard = (req, res) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  return Card.create(newCardData)
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const deleteCardById = (req, res) => {
  const { id } = req.params;
  return Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Картачки с данным id несуществует' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === 'CastError') return res.status(400).send({ message: 'У карточки некорректный id' });
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((newCard) => {
  if (!newCard) {
    return res.status(404).send({ message: 'Картачки с данным id несуществует' });
  }
  return res.status(201).send(newCard);
})
  .catch((err) => {
    if (err.name === 'CastError') return res.status(400).send({ message: 'У карточки некорректный id' });
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
      });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  });

const dislikeCard = (req, res) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((newCard) => {
    if (!newCard) {
      return res.status(404).send({ message: 'Картачки с данным id несуществует' });
    }
    return res.status(200).send(newCard);
  })
  .catch((err) => {
    if (err.name === 'CastError') return res.status(400).send({ message: 'У карточки некорректный id' });
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
      });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  });

module.exports = {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
};
