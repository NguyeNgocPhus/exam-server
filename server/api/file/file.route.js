const express = require('express');
const fileCtrl = require('./file.controller');
const router = express.Router();
router.route('/programing').post(fileCtrl.saveFileP);
router.route('/design').post(fileCtrl.saveFileD);

module.exports = router;
