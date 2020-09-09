/* eslint-disable no-shadow */
/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-prototype-builtins */
const CONST = require('../constants/const.js');
const User = require('../api/user/user.model');
const Play = require('../api/play/play.model');

async function scoreCaculation(play) {
  const result = await Play.findById(play._id)
    .populate('history.questions.questionId')
    .populate('history.problems.problemId');
  result.time = play.time;
  let score = 0;
  for (let i = 0; i < play.history.questions.length; i++) {
    if (play.history.questions[i].answer === result.history.questions[i].questionId.correctAnswer) {
      result.history.questions[i].answer = result.history.questions[i].questionId.correctAnswer;
      score += +result.history.questions[i].questionId.score;
    } else {
      result.history.questions[i].answer = play.history.questions[i].answer;
    }
    if (play.history.questions[i].answer !== 'false') {
      result.history.questions[i].answered = true;
    }
  }
  result.totalScore = score;
  result.save();
  return result;
}

// eslint-disable-next-line no-unused-vars
module.exports = function(socket) {
  return async function(data) {
    try {
      switch (data.comand) {
        case 1000: {
          const play = data.data;
          const result = await scoreCaculation(play);
          if (result) {
            const data = { code: 2, mesange: 'Tiếp tục', data: result };
            if (global.hshUserSocket.hasOwnProperty(result.userID)) {
              const socketid = global.hshUserSocket[result.userID];
              global.hshIdSocket[socketid].emit(CONST.NAMESPACE.QUESTION, data);
            } else {
              console.log(`Error, check user: ${result.userID}`);
            }
          }
          break;
        }
        case 2000: {
          const play = data.data;
          if (play) {
            Play.findById(play.data._id).then((result) => {
              result.time = data.time;
              result.save();
            });
          }
          break;
        }
        case 3000: {
          User.findOne({ studentId: data.studentId }).then((user) => {
            Play.findOne({ userID: user._id }).then((play) => {
              play.status = 2;
              play.save();
              Play.findOne({ userID: user._id }).then(async (resultplay) => {
                if (resultplay) {
                  const result = { code: 2, mesange: 'Tiếp tục', data: resultplay };
                  if (global.hshUserSocket.hasOwnProperty(user._id)) {
                    const socketid = global.hshUserSocket[user._id];
                    global.hshIdSocket[socketid].emit(CONST.NAMESPACE.QUESTION, result);
                  } else {
                    console.log(`Error, check user: ${user._id}`);
                  }
                }
              });
            });
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
};
