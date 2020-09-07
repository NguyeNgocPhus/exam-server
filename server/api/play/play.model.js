/* eslint-disable object-curly-newline */
const mongoose = require('mongoose');
const { boolean } = require('joi');

const playSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    history: {
      questions: [
        {
          questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
          answered: Boolean,
          answer: String,
        },
      ],
      problems: [
        {
          problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
          correct: Boolean,
          score: Number,
        },
      ],
      designs: [
        {
          title: String,
          content: String,
          requirement: [{ item: String }],
        },
      ],
    },
    subject: { type: Boolean, default: false },
    time: { type: Number, default: 60 * 60 },
    status: { type: Number, default: 0 },
    interviewScore: { type: Number, default: 0 },
    interviewer: { type: String },
    comment: { type: String },
    totalScore: { type: Number, default: 0 },
    totalTime: { type: Number, default: 60 * 60 },
  },
  { collection: 'plays', timestamps: true },
);

/**
 * Statics
 */
playSchema.statics = {
  async get(id) {
    const play = await this.findById(id);
    return play;
  },

  async list({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
    const data = await this.find(filter)
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
      .populate('userID', 'name studentId phone class email')
      .exec();
    const count = await this.find(filter).count();
    return { data, count, limit, skip };
  },
};

module.exports = mongoose.model('Play', playSchema);
