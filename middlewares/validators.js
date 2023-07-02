const {
  celebrate,
  Joi,
} = require('celebrate');

const patternUrl = /https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/;

const loginValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

const createUserValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(patternUrl),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

const getUserValidator = celebrate({
  params: Joi.object()
    .keys({
      id: Joi.string()
        .length(24)
        .hex()
        .required(),
    }),
});

const updateUserByIdValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
    }),
});

const updateUserAvatarValidator = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .pattern(patternUrl),
    }),
});

const createCardValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .pattern(patternUrl),
    }),
});

const deleteCardValidator = celebrate({
  params: Joi.object()
    .keys({
      id: Joi.string()
        .length(24)
        .hex()
        .required(),
    }),
});

const likeCardValidator = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .length(24)
        .hex()
        .required(),
    }),
});

const dislikeCardValidator = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .length(24)
        .hex()
        .required(),
    }),
});

module.exports = {
  loginValidator,
  createUserValidator,
  getUserValidator,
  updateUserByIdValidator,
  updateUserAvatarValidator,
  createCardValidator,
  deleteCardValidator,
  likeCardValidator,
  dislikeCardValidator,
};
