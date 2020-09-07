const config = require('../../config/config');
const APIError = require('../helpers/APIError');

function master(req, res, next) {
  if (req.token && req.token !== config.masterSecret) return next(new APIError('Master key is not correct'));
  return next();
}

module.exports = { master };
