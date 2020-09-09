/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const httpStatus = require('http-status');
const Play = require('./play.model');
const User = require('../user/user.model');
const Question = require('../questionList/questionList.model');
const Problem = require('../problem/problem.model');
const Design = require('../design/design.model');

async function list(req, res) {
  const { limit = 500, skip = 0, sort, filter } = req.query;
  const questions = await Play.list({ limit, skip, sort, filter });
  res.status(httpStatus.OK).json(questions);
}

async function start(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(httpStatus.NOT_FOUND).end();
  user.isInterviewing = true;
  user.save().then((result) => res.status(httpStatus.OK).json(result));
}

async function interview(req, res) {
  const { interviewScore, comment, interviewer } = req.body;
  const play = await Play.findById(req.params.id);
  if (!play) return res.status(httpStatus.NOT_FOUND).end();
  if (play.isInterviewed === false) {
    play.interviewScore = interviewScore;
    play.comment = comment;
    play.interviewer = interviewer;
    play.isInterviewed = true;
    const user = await User.findById(play.userID);
    user.isInterviewing = false;
    await user.save();
    return play.save().then((result) => res.status(httpStatus.OK).json(result));
  }
  return res.status(httpStatus.FORBIDDEN).json({ message: 'Sinh viên đã được phỏng vấn' });
}

async function GetPlay(req, res) {
  const { studentId } = req.body;
  if (studentId) {
    const user = await User.findOne({ studentId });
    if (!user) return res.status(httpStatus.NOT_FOUND);
    if (user && user.role === 'user') {
      const play = await Play.findOne({ userID: user._id })
        .populate('history.questions.questionId', 'options content')
        .populate('history.problems.problemId');
      if (play) {
        res.status(httpStatus.OK).json({ data: play });
      } else {
        const newPlay = new Play({
          userID: user._id,
          history: {
            questions: await Question.random(),
            problems: await Problem.random(),
            designs: await Design.random(),
          },
        });
        newPlay.save().then(async (result) => {
          const playadd = await Play.findById(result._id)
            .populate('history.questions.questionId', 'options content')
            .populate('history.problems.problemId');
          user.playId = result._id;
          await user.save();
          res.status(httpStatus.OK).json({ data: playadd });
        });
      }
    }
  }
}

module.exports = { GetPlay, start, list, interview };
