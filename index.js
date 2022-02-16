/* eslint-disable no-console */
const http = require('http');
const socket = require('socket.io');

const config = require('./config/config');
const app = require('./config/express');

const socketIndex = require('./server/socket/index');
require('./config/mongoose');

global.hshSocketUser = {};
global.hshUserSocket = {};
global.hshIdSocket = {};
global.hshUserTimeout = {};
global.userCount = 0;
global.userCurrentPlay = {};
const server = http.createServer(app);
global.io = socket(server, { transports: ['websocket', 'polling'] });

if (!module.parent) {
  server.listen(3000, () => {
    console.log('\x1b[33m%s\x1b[0m', `Server started on port ${config.port} (${config.env})`);
    global.io.on('connection', socketIndex);
  });
}

module.exports = app;
