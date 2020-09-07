/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    input: String,
    output: String,
    correctScore: Number,
    level: Number,
  },
  { collection: 'problems', timestamps: true },
);

problemSchema.statics = {
  async get(id) {
    const problem = await this.findById(id);
    return problem;
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
  async random() {
    const arr = [];
    const proEasy = await this.find({ level: 1 });
    const proNomal = await this.find({ level: 2 });
    const proHard = await this.find({ level: 3 });
    arr.push({
      problemId: proEasy[Math.floor(Math.random() * proEasy.length)]._id,
      correct: false,
      score: 0,
    });
    arr.push({
      problemId: proNomal[Math.floor(Math.random() * proNomal.length)]._id,
      correct: false,
      score: 0,
    });
    arr.push({
      problemId: proHard[Math.floor(Math.random() * proHard.length)]._id,
      correct: false,
      score: 0,
    });
    return arr;
  },
};

module.exports = mongoose.model('Problem', problemSchema);
