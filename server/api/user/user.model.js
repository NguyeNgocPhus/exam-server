const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const bcrypt = require('bcrypt');
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    class: String,
    studentId: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isLocked: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isExam: { type: Boolean, default: false },
    playId: { type: mongoose.Schema.Types.ObjectId, ref: 'Play' },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'judge', 'receptionist'] },
  },
  { collection: 'users', timestamps: true },
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({});

UserSchema.statics = {
  async get(id) {
    const user = await this.findById(id).populate({
      path: 'playId',
      populate: {
        path: 'history.questions.questionId',
      },
    });
    return user;
  },

  async list({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
    const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0 })
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
      .exec();
    const count = await this.find(filter).count();
    return { data, count, limit, skip };
  },
};

module.exports = mongoose.model('User', UserSchema);
