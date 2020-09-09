const express = require('express');
const validate = require('express-validation');
const authValidation = require('./auth.validation');
const authCtrl = require('./auth.controller');
const { master } = require('../../middleware/master');
const { isAuthenticated } = require('../../middleware/authentication');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login').post(master, validate(authValidation.login), authCtrl.login);
router.route('/check').get(isAuthenticated(['user', 'admin', 'judge', 'receptionist']), authCtrl.check);

module.exports = router;
