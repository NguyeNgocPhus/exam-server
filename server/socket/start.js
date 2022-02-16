/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-prototype-builtins */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable space-before-function-paren */
const jwt = require('jsonwebtoken');
const CONST = require('../constants/const.js');
const config = require('../../config/config');
const User = require('../api/user/user.model');

function errorWithMessage(socket, message) {
  socket.emit(CONST.NAMESPACE.AUTH, { command: CONST.RETURN.AUTH.LOGIN, code: 2, message });
  socket.disconnect('unauthorized');
}

function success(socket, user){

console.log(user);
  if (user.role === 'user') {
    socket.broadcast.emit(CONST.NAMESPACE.AUTH, {
      command: CONST.RETURN.AUTH.USER_GO_ONLINE,
      user: { name: user.name, studentId: user.studentId },
    });
    global.userCount++;
  }
  user.isOnline = true;
  global.hshSocketUser[socket.id] = user._id;
  global.hshUserSocket[user._id] = socket.id;
  global.hshIdSocket[socket.id] = socket;
  user.save();
  console.log(`${global.userCount} users online now`);
  console.log(`${user.name} - ${user.studentId} is online`);
}

module.exports = function(socket) {
  return function(data) {
    try {
      if (data.command === CONST.RECEIVE.LOGIN.AUTH) {
        const { token } = data;
        if (token) {
          jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
              errorWithMessage(socket, 'Authentication failed.');
            } else {
              User.findById(decoded._id, (err, user) => {
                if (err) throw err;
                if (!user) {
                  errorWithMessage(socket, 'Authentication failed.');
                } else if (user.isLocked) {
                  errorWithMessage(socket, 'User is locked.');
                } else if (user) {
                  if (global.hshUserSocket.hasOwnProperty(user.id)) {
                    return errorWithMessage(socket, 'User already online.');
                  }
                  else{
                    success(socket, user);
                  }
                }
              });
            }
          });
        } else {
          errorWithMessage(socket, 'Authentication failed.');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
};
