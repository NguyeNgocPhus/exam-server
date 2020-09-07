/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');

const questionListSchema = new mongoose.Schema(
  {
    name: String,
    usingQuestion: Number,
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        point: Number,
      },
    ],
    isRandom: Boolean,
  },
  { collection: 'questionLists', timestamps: true },
);

/**
 * Statics
 */
questionListSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('questions.questionId')
      .exec()
      .then((questionList) => {
        if (questionList) {
          return questionList;
        }
        const err = new APIError('No such questionList exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  async list({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
    const data = await this.find(filter)
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
      .populate('questions.questionId')
      .exec();
    const count = await this.find(filter).count();
    return { data, count, limit, skip };
  },

  async random() {
    const allQuestions = await this.find();
    const returnQuestions = [];
    allQuestions.map(async (item) => {
      _.shuffle(item.questions)
        .slice(0, item.usingQuestion)
        .map((i) => returnQuestions.push({ questionId: i.questionId, answer: false }));
    });
    return returnQuestions;
  },
};

module.exports = mongoose.model('QuestionList', questionListSchema);
