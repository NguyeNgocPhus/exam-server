const Joi = require('joi');

module.exports = {
  create: {
    body: {
      phone: Joi.string().required(),
      studentId: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      role: Joi.string().required(),
      className: Joi.string().required(),
    },
  },

  update: {
    body: {
      phone: Joi.string().required(),
      studentId: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      role: Joi.string().required(),
      className: Joi.string().required(),
    },
    params: {
      userId: Joi.string()
        .hex()
        .required(),
    },
  },
};
