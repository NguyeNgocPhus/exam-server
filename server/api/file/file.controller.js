/* eslint-disable no-unused-vars */
const fs = require('fs');
const User = require('../user/user.model');
const Play = require('../play/play.model');

async function saveFileP(req, res, next) {
  const { file } = req.files;
  const user = await User.findOne({ studentId: file.name.split('-')[0] }).populate('playId');
  if (user.playId && user.playId.subject === 2) {
    return res.json({ message: 'Không được thi 2 bài thi' });
  }
  const play = await Play.findById(user.playId._id);
  play.subject = 1;
  play.save();
  fs.writeFile(`${__dirname}/upload/programing/${file.name}`, file.data, 'binary', (err) => {
    if (err) return res.status(400).json({ message: err });
    return res.status(200).json({ message: 'Submit thành công' });
  });
}

async function saveFileD(req, res, next) {
  const { file } = req.files;
  const fileName = file.name.split('-');
  const user = await User.findOne({ studentId: file.name.split('-')[0] }).populate('playId');
  if (user.playId && user.playId.subject === 1) {
    return res.json({ message: 'Không được thi 2 bài thi' });
  }
  const play = await Play.findById(user.playId._id);
  play.subject = 2;
  play.save();
  if (!fs.existsSync(`${__dirname}/upload/design/${fileName[0]}`)) {
    fs.mkdirSync(`${__dirname}/upload/design/${fileName[0]}`);
  }
  fs.writeFile(`${__dirname}/upload/design/${fileName[0]}/${fileName[1]}`, file.data, 'binary', (err) => {
    if (err) return res.status(400).json({ message: err });
    return res.status(200).json({ message: 'Submit thành công' });
  });
}

module.exports = { saveFileP, saveFileD };
