const Joi = require('joi');

module.exports = {
  create: {
    body: {
      title: Joi.string().required(),
      content: Joi.string().required(),
      input: Joi.string().required(),
      output: Joi.string().required(),
      correctScore: Joi.number().required(),
      level: Joi.number().required(),
    },
  },
  update: {
    body: {
      title: Joi.string().required(),
      content: Joi.string().required(),
      input: Joi.string().required(),
      output: Joi.string().required(),
      correctScore: Joi.string().required(),
      level: Joi.string().required(),
    },
    params: {
      userId: Joi.string()
        .hex()
        .required(),
    },
  },
};
