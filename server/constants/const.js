module.exports = {
  NAMESPACE: {
    LOGIN: 'login',
    AUTH: 'auth',
    ADMIN: 'admin',
    VIEWER: 'viewer',
    USER: 'user',
    QUESTION: 'question',
    DISCONNECT: 'disconnect',
  },
  ROOMS: { ADMIN: 'admin room', VIEWER: 'viewer room', USER: 'user room' },
  RECEIVE: {
    LOGIN: { AUTH: 1000 },
  },
  RETURN: {
    AUTH: { LOGIN: 1000, USER_GO_ONLINE: 1001, DISCONNECT: 1002 },
    QUEST: { RAISE: 2000, CHOOSE_ANSWER: 2001, FINISHED_ROUTE: 2002 },
  },
};
