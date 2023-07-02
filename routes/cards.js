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
  createCardValidator,
  deleteCardValidator,
  likeCardValidator,
  dislikeCardValidator,
} = require('../middlewares/validators');

router.get('/', getCards);

router.post('/', createCardValidator, createCard);

router.delete('/:id', deleteCardValidator, deleteCard);

router.put('/:cardId/likes', likeCardValidator, likeCard);

router.delete('/:cardId/likes', dislikeCardValidator, dislikeCard);

module.exports = router;
