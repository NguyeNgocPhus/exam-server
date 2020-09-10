const express = require('express');
const webpush = require('web-push');
const userRoutes = require('./server/api/user/user.route');
const authRoutes = require('./server/api/auth/auth.route');
const playRoutes = require('./server/api/play/play.route');
const problemRoutes = require('./server/api/problem/problem.route');
const questionRoutes = require('./server/api/question/question.route');
const questionListRoutes = require('./server/api/questionList/questionList.route');
const checkinRoutes = require('./server/api/checkin/checkin.route');
const designRoutes = require('./server/api/design/design.route');
const fileRoutes = require('./server/api/file/file.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/play', playRoutes);
router.use('/problem', problemRoutes);
router.use('/question', questionRoutes);
router.use('/questionlist', questionListRoutes);
router.use('/checkin', checkinRoutes);
router.use('/design', designRoutes);
router.use('/file', fileRoutes);
router.get('/noti', (req, res) => {
  const subscription = req.body;
  const payload = JSON.stringify({ title: 'Push Test' });
  webpush.sendNotification(subscription, payload).catch((err) => console.error(err));
  res.status(201).end();
});
module.exports = router;
