/* eslint-disable object-curly-newline */
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    content: String,
    options: [{ numbering: String, answer: String }],
    correctAnswer: String,
    score: Number,
  },
  { timestamps: true, collection: 'questions' },
);

questionSchema.statics = {
  async get(id) {
    const question = await this.findById(id);
    return question;
  },

  async list({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
    const data = await this.find(filter)
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
      .exec();
    const count = await this.find(filter).count();
    return { data, count, limit, skip };
  },
};

module.exports = mongoose.model('Question', questionSchema);
