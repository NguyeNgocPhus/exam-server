/* eslint-disable no-unused-vars */
const fs = require('fs');

async function saveFileP(req, res, next) {
  const { file } = req.files;
  fs.writeFile(`${__dirname}/upload/programing/${file.name}`, file.data, 'binary', (err) => {
    if (err) return res.status(400).json({ message: 'Submit thất bại' });
    return res.status(200).json({ message: 'Submit thành công' });
  });
}

async function saveFileD(req, res, next) {
  const { file } = req.files;
  fs.writeFile(`${__dirname}/upload/design/${file.name}`, file.data, 'binary', (err) => {
    if (err) return res.status(400).json({ message: 'Submit thất bại' });
    return res.status(200).json({ message: 'Submit thành công' });
  });
}

module.exports = { saveFileP, saveFileD };
