/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const httpStatus = require('http-status');
const QuestionList = require('./questionList.model');
const Question = require('../question/question.model');
const APIError = require('../../helpers/APIError');

async function load(req, res, next, id) {
  req.questionList = await QuestionList.get(id);
  if (!req.questionList) next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  next();
}

async function list(req, res) {
  const { limit = 500, skip = 0, sort, filter } = req.query;
  const questionLists = await QuestionList.list({ limit, skip, sort, filter });
  res.json(questionLists);
}

async function create(req, res, next) {
  try {
    const { name, questions, usingQuestion, isRandom } = req.body;
    try {
      let questionsArray = [];
      const a = questions.map(async (item) => {
        const question = await Question.findById(item);
        return { questionId: question._id, point: question.score };
      });
      questionsArray = await Promise.all(a);
      const listQ = new QuestionList({ name, usingQuestion, questions: questionsArray, isRandom });
      await listQ.save();
      res.status(httpStatus.OK).json(listQ);
    } catch (err) {
      next(err);
    }
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { name, questions, usingQuestion, isRandom } = req.body;
    let questionsArray = [];
    const a = questions.map(async (item) => {
      const question = await Question.findById(item);
      return { questionId: question._id, point: question.score };
    });
    questionsArray = await Promise.all(a);
    const { questionList } = req;
    questionList.name = name;
    questionList.usingQuestion = usingQuestion;
    questionList.questions = questionsArray;
    questionList.isRandom = isRandom;
    questionList.save();
    res.status(httpStatus.OK).json(questionList);
  } catch (e) {
    next(e);
  }
}

function remove(req, res) {
  const { questionList } = req;
  questionList.remove();
  res.status(httpStatus.OK).json(questionList);
}

function get(req, res) {
  res.json(req.questionList);
}

module.exports = { list, load, create, update, remove, get };
