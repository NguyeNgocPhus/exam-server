/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const User = require('../user/user.model');

function passwordMaker(name, studentId) {
  let str = name.substring(name.lastIndexOf(' ') + 1).toLowerCase();
  const AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp(`[${AccentsMap[i].substr(1)}]`, 'g');
    const char = AccentsMap[i][0];
    // eslint-disable-next-line no-param-reassign
    str = str.replace(re, char);
  }
  return str + studentId.slice(studentId.length - 4);
}

async function load(req, res, next, id) {
  req.user = await User.findById(id);
  if (!req.user) next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  next();
}

async function list(req, res) {
  const { limit = 50, skip = 0, filter, sort } = req.query;
  const user = await User.list({ limit, skip, filter, sort });
  res.status(httpStatus.OK).json(user);
}

async function create(req, res, next) {
  try {
    const { name, studentId, email, phone, className } = req.body;
    const duplicate = await User.findOne({ studentId });
    if (duplicate) res.status(httpStatus.CONFLICT).end();
    const user = new User({
      phone,
      studentId,
      password: passwordMaker(name, studentId),
      name,
      class: className,
      email,
    });
    user.save();
    res.status(httpStatus.OK).json(user);
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { isExam } = req.body;
    const { user } = req;
    user.isExam = isExam;
    user.save();
    res.status(httpStatus.OK).json(user);
  } catch (e) {
    next(e);
  }
}

function remove(req, res) {
  const { user } = req;
  user.remove();
  res.status(httpStatus.OK).json(user);
}

function get(req, res) {
  return res.status(httpStatus.OK).json(req.user);
}

module.exports = { list, load, create, update, remove, get };
