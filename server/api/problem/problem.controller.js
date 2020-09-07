/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const httpStatus = require('http-status');
const Problem = require('./problem.model');
const APIError = require('../../helpers/APIError');

async function load(req, res, next, id) {
  req.problem = await Problem.findById(id);
  if (!req.problem) next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  next();
}

async function list(req, res) {
  const { limit = 500, skip = 0, sort, filter } = req.query;
  const problems = await Problem.list({ limit, skip, sort, filter });
  res.json(problems);
}

async function create(req, res) {
  const { title, content, input, output, correctScore, level } = req.body;
  const problem = new Problem({ title, content, input, output, correctScore, level });
  problem.save();
  res.status(httpStatus.OK).json({ code: 1, data: problem });
}

async function update(req, res) {
  const { title, content, input, output, correctScore, level } = req.body;
  const { problem } = req;
  problem.title = title;
  problem.content = content;
  problem.input = input;
  problem.output = output;
  problem.correctScore = correctScore;
  problem.level = level;
  problem.save();
  res.status(httpStatus.OK).json(problem);
}

function remove(req, res) {
  req.problem.remove();
  res.status(httpStatus.OK).json(req.problem);
}

function get(req, res) {
  res.json(req.problem);
}

module.exports = {
  list,
  load,
  create,
  update,
  remove,
  get,
};
