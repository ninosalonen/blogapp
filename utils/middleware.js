const jwt = require('jsonwebtoken');
const logger = require('./logger');
require('dotenv').config();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtract = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtract = (request, response, next) => {
  if (request.token) {
    const decoded = jwt.verify(request.token, process.env.SECRET);
    request.userInfo = decoded;
  }

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtract,
  userExtract,
};
