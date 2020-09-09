/* eslint-disable no-unused-vars */
const fs = require("fs");

async function saveFileP(req, res, next) {
  const { file } = req.files;
  fs.writeFile(
    `${__dirname}/upload/programing/${file.name}`,
    file.data,
    "binary",
    (err) => {
      if (err) return res.status(400).json({ message: err });
      return res.status(200).json({ message: "Submit thành công" });
    }
  );
}

async function saveFileD(req, res, next) {
  const { file } = req.files;
  const fileName = file.name.split("-");
  if (!fs.existsSync(`${__dirname}/upload/design/${fileName[0]}`)) {
    fs.mkdirSync(`${__dirname}/upload/design/${fileName[0]}`);
  }
  fs.writeFile(
    `${__dirname}/upload/design/${fileName[0]}/${fileName[1]}`,
    file.data,
    "binary",
    (err) => {
      if (err) return res.status(400).json({ message: err });
      return res.status(200).json({ message: "Submit thành công" });
    }
  );
}

module.exports = { saveFileP, saveFileD };