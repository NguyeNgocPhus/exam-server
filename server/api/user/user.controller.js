/* eslint-disable object-curly-newline */
const httpStatus = require('http-status');
const User = require('./user.model');
const APIError = require('../../helpers/APIError');

async function load(req, res, next, id) {
  req.user = await User.get(id);
  if (!req.user) return next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  return next();
}

function get(req, res) {
  res.status(httpStatus.OK).json(req.user);
}

function getMe(req, res) {
  res.status(httpStatus.OK).json(req.auth);
}

async function updateMe(req, res, next) {
  try {
    const { name, studentId, email, phone, className } = req.body;
    const user = await User.findOne({ studentId });
    if (user && user.studentId !== studentId) res.status(httpStatus.CONFLICT).json({ message: 'Đã tồn tại tài khoản' });
    const newUser = req.auth;
    newUser.name = name;
    newUser.studentId = studentId;
    newUser.email = email;
    newUser.phone = phone;
    newUser.className = className;
    newUser.save();
    res.status(httpStatus.OK).json(newUser);
  } catch (e) {
    next(e);
  }
}

async function create(req, res) {
  const { name, studentId, password, email, className, phone, role } = req.body;
  const user = await User.findOne({ studentId });
  if (user) return res.status(httpStatus.CONFLICT).end();
  const newUser = new User({ name, studentId, password, email, class: className, phone, role });
  newUser.save();
  return res.status(httpStatus.OK).json(newUser);
}

async function update(req, res) {
  const { name, studentId, email, className, password, phone, role } = req.body;
  const user = await User.findOne({ studentId });
  if (user && user.studentId !== studentId) return res.status(httpStatus.CONFLICT).end();
  const newUser = req.user;
  newUser.name = name;
  newUser.studentId = studentId;
  newUser.email = email;
  newUser.phone = phone;
  newUser.role = role;
  newUser.password = password;
  newUser.class = className;
  newUser.save();
  return res.status(httpStatus.OK).json(newUser);
}

async function list(req, res) {
  const { limit = 50, skip = 0, filter, sort } = req.query;
  const users = await User.list({ limit, skip, filter, sort });
  res.status(httpStatus.OK).json(users);
}

function remove(req, res) {
  const { user } = req;
  user.remove();
  res.status(httpStatus.OK).json(user);
}

module.exports = { load, get, getMe, create, update, list, remove, updateMe };
