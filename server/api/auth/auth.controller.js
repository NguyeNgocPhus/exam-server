/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const config = require('../../../config/config');
const User = require('../user/user.model');
const mail = require('../../helpers/mailing.js');

function successResponse(user, res) {
  if (user.role === 'user') {
    user.isOnline = true;
    user.save();
  }
  const token = jwt.sign({ _id: user._id, studentId: user.studentId }, config.jwtSecret);
  return res.status(200).json({
    code: 1,
    token,
    user: {
      name: user.name,
      role: user.role,
      studentId: user.studentId,
      email: user.email,
    },
  });
}

function errorResponse(next) {
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}

async function login(req, res, next) {
  const { studentId, password } = req.body;
  const user = await User.findOne({ studentId, password });
  if (!user) errorResponse(next);
  if (user.isLocked) return res.json({ code: 2, message: 'Người dùng bị khoá' }).end();
  if (user.isOnline) return res.json({ code: 2, message: 'Người dùng đang online' }).end();
  return successResponse(user, res);
}

/**
 * Trả về thành công nếu token hợp lệ
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function check(req, res, next) {
  res.status(200).json({
    code: 1,
  });
}

module.exports = { login, check };
