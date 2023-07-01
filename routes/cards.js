const router = require('express')
  .Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  celebrate,
  Joi,
} = require('celebrate');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .pattern(/https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/),
    }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object()
    .keys({
      id: Joi.string()
        .alphanum()
        .length(24),
    }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
}), dislikeCard);

module.exports = router;
