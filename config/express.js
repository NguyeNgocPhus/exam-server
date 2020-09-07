/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const bearerToken = require('express-bearer-token');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const winstonInstance = require('./winston');
const routes = require('../index.route');
const config = require('./config');
const APIError = require('../server/helpers/APIError');

const app = express();
if (config.env === 'development') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(bearerToken());
app.use(helmet());
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(fileUpload({ createParentPath: true }));

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map((error) => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  }
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({ winstonInstance }));
}

app.use((err, req, res) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {},
  }),
);

module.exports = app;
