const mongoose = require('mongoose');
const history = require('connect-history-api-fallback');
require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const testingRouter = require('./controllers/devRouter');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const app = express();
app.use('/', express.static('build'));
app.use(history({ verbose: true }));
app.use(express.static(__dirname));
app.use(morgan('combined'));

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  logger.info('Connected to MONGODB');
}).catch((error) => {
  logger.error('Error connecting', error.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(middleware.tokenExtract);
app.use(middleware.userExtract);

app.use('/api/blogs/', blogsRouter);
app.use('/api/users/', usersRouter);
app.use('/api/login/', loginRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
