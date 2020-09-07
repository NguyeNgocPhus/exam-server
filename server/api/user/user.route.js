const express = require('express');
const validate = require('express-validation');
const userValidation = require('./user.validation');
const userCtrl = require('./user.controller');
const { isAuthenticated } = require('../../middleware/authentication');

const router = express.Router();

router
  .route('/')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), userCtrl.list)
  .post(isAuthenticated(['admin']), validate(userValidation.create), userCtrl.create);

router
  .route('/:userId')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), userCtrl.get)
  .put(isAuthenticated(['admin']), validate(userValidation.update), userCtrl.update)
  .delete(isAuthenticated(['admin']), userCtrl.remove);

router
  .route('/info/me')
  .get(isAuthenticated(['user', 'admin', 'judge', 'receptionist']), userCtrl.getMe)
  .put(isAuthenticated(['user', 'admin', 'judge', 'receptionist']), userCtrl.updateMe);
router.param('userId', userCtrl.load);

module.exports = router;
