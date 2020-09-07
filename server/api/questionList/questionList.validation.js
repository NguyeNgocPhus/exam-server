const Joi = require('joi');

module.exports = {
  create: {
    body: {
      name: Joi.string().required(),
      questions: Joi.array().required(),
      usingQuestion: Joi.number().required(),
      isRandom: Joi.boolean().required(),
    },
  },
  update: {
    body: {
      name: Joi.string().required(),
      questions: Joi.array().required(),
      usingQuestion: Joi.number().required(),
      isRandom: Joi.boolean().required(),
    },
  },
};
