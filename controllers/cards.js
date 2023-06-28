const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

// const setErrors = (res, err) => {
//   if (err.message === 'NoValidId') return res.status(404).send({ message: 'Запрашиваемый id не найден' });
//
//   if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
//
//   if (err.name === 'ValidationError') {
//     return res.status(400).send({
//       message: `${Object.values(err.errors)
//         .map((error) => error.message)
//         .join(', ')}`,
//     });
//   }
//   return res.status(500).send({ message: 'Ошибка сервера' });
// };

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  return Card.create(newCardData)
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(`${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(new NotFound('Карточка не найдена'))
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        return Card.deleteOne({ _id: id })
          .then(() => res.status(200).send({ message: `Карточка ${id} удалена` }))
          .catch(next);
      }
      return res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
    })
    .catch(next);
};

const likeCard = (req, res, next) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFound('Карточка не найдена'))
  .then((newCard) => res.status(200).send(newCard))
  .catch(next);

const dislikeCard = (req, res, next) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('NoValidId'))
  .then((newCard) => res.status(200).send(newCard))
  .catch(next);

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
