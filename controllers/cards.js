const Card = require('../models/card');
const User = require("../models/user");

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards));

const createCard = (req, res) => {
  console.log(req.user._id);
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  console.log(newCardData);
  return Card.create(newCardData)
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const deleteCardById = (req, res) => {
  const { id } = req.params;
  console.log(id);
  return Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
};
