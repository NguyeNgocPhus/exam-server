/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../../config/config');
const User = require('../api/user/user.model');
// const APIError = require('../helpers/APIError');

function isAuthenticated(array) {
  return async (req, res, next) => {
    console.log(req.token);
    jwt.verify(req.token, config.jwtSecret, async (err, data) => {
      if (err) return next(err);
      const filter = { password: 0, createdAt: 0, updatedAt: 0, playId: 0 };
      const user = await User.findOne({ studentId: data.studentId }, filter);
      if (user && array.indexOf(user.role) >= 0) {
        req.auth = user;
        next();
      } else {
        res.status(httpStatus.UNAUTHORIZED).end();
      }
    });
  };
}

module.exports = { isAuthenticated };
