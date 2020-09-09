const Joi = require('joi');

module.exports = {
  create: {
    body: {
      phone: Joi.string().required(),
      studentId: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
      className: Joi.string().required(),
      isExam: Joi.string().required(),
      role: Joi.string().required(),
    },
  },
  update: {
    body: {
      isExam: Joi.boolean().required(),
    },
    params: {
      checkinId: Joi.string()
        .hex()
        .required(),
    },
  },
};
