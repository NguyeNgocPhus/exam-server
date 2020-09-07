const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const config = require('../../../config/config');
const User = require('../user/user.model');

const saltRounds = 10;
const mail = require('../../helpers/mailing.js');

function successResponse(user, res) {
  user.isOnline = true;
  user.save();
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

/**
 * Trả về token và thông tin nếu đăng kí thành công
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function signup(req, res, next) {
  const { name, studentId, password, email, phone } = req.body;
  try {
    const studentIdExist = await User.findOne({ studentId }).exec();
    if (studentIdExist) {
      return res.status(401).json({
        code: 2,
        message: 'Mã sinh viên đã tồn tại !',
      });
    }
    const emailExist = await User.findOne({ email }).exec();
    if (emailExist) {
      return res.status(401).json({
        code: 2,
        message: 'Email đã tồn tại !',
      });
    }
    let code;
    let codeExist;
    do {
      code = Math.floor(Math.random() * (999999 - 100000) + 100000);
      codeExist = await User.findOne({ activationCode: code }).exec();
    } while (codeExist);
    //= ======================================================================
    const user = new User({
      phone,
      studentId,
      password,
      name,
      email,
      activationCode: code,
    });
    user
      .save()
      .then((result) => {
        mail.sendMail(user.email, code);
        return res.status(200).json({
          code: 1,
          message: 'Mã xác nhận đã được gửi đến email của bạn',
        });
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
}

async function active(req, res, next) {
  const { studentId, code } = req.body;
  try {
    const user = await User.findOne({ activationCode: code, studentId })
      .exec()
      .catch((e) => next(e));
    if (user) {
      if (user.isActived) {
        return res.status(200).json({
          code: 2,
          message: 'Tài khoản đã được xác nhận !',
        });
      }
      await User.findByIdAndUpdate(user._id, { isLocked: false, isActived: true });
      return res.status(200).json({
        code: 1,
        message: 'Active your account',
      });
    }
    return res.status(401).json({
      code: 2,
      message: 'Người dùng không tồn tại !',
    });
  } catch (error) {
    next(error);
  }
}

async function resend(req, res, next) {
  const { studentId } = req.body;
  try {
    const user = await User.findOne({ studentId })
      .exec()
      .catch((e) => next(e));
    if (user) {
      if (user.isActived) {
        return res.status(200).json({
          code: 2,
          message: 'Tài khoản đã được xác nhận !',
        });
      }
      let code;
      let codeExist;
      do {
        code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        codeExist = await User.findOne({ activationCode: code }).exec();
      } while (codeExist);
      user.activationCode = code;
      user.save();
      mail.sendMail(user.email, code);
      return res.status(200).json({
        code: 1,
        message: 'Mã xác nhận đã được gửi đến email của bạn',
      });
    }
    return res.status(401).json({
      code: 2,
      message: 'Resend failed',
    });
  } catch (error) {
    next(error);
  }
}

async function change(req, res, next) {
  const { studentId, email } = req.body;
  try {
    const user = await User.findOne({ studentId })
      .exec()
      .catch((e) => next(e));
    if (user) {
      if (user.isActived) {
        return res.status(200).json({
          code: 2,
          message: 'Tài khoản đã được xác nhận !',
        });
      }
      user.email = email;
      user.save();
      let code;
      let codeExist;
      do {
        code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        codeExist = await User.findOne({ activationCode: code }).exec();
      } while (codeExist);
      mail.sendMail(user.email, code);
      return res.status(200).json({
        code: 1,
        message: 'Thay đổi email thành công, vui lòng kiểm tra hộp thư mới !',
      });
    }
    return res.status(401).json({
      code: 2,
      message: 'Resend failed',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  check,
  signup,
  active,
  resend,
  change,
};
