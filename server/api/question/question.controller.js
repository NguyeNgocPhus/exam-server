/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const httpStatus = require('http-status');
const Question = require('./question.model');
const APIError = require('../../helpers/APIError');

async function load(req, res, next, id) {
  req.question = await Question.get(id);
  if (!req.question) next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  next();
}

async function list(req, res) {
  const questions = await Question.list(req.query);
  res.status(httpStatus.OK).json(questions);
}

async function create(req, res, next) {
  try {
    const { content, answer1, answer2, answer3, answer4, correctAnswer, score } = req.body;
    const question = new Question({
      content,
      options: [
        { numbering: 'a', answer: answer1 },
        { numbering: 'b', answer: answer2 },
        { numbering: 'c', answer: answer3 },
        { numbering: 'd', answer: answer4 },
      ],
      correctAnswer,
      score,
    });
    question.save();
    res.status(httpStatus.OK).json(question);
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { content, answer1, answer2, answer3, answer4, correctAnswer, score } = req.body;
    const { question } = req;
    question.content = content;
    question.options[0].answer = answer1;
    question.options[1].answer = answer2;
    question.options[2].answer = answer3;
    question.options[3].answer = answer4;
    question.correctAnswer = correctAnswer;
    question.score = score;
    question.save();
    res.status(httpStatus.OK).json(question);
  } catch (e) {
    next(e);
  }
}

function remove(req, res) {
  req.question.remove();
  res.status(httpStatus.OK).json(req.question);
}

function get(req, res) {
  res.json(req.question);
}

module.exports = { list, load, create, update, remove, get };
