/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */

const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('express-async-errors');

usersRouter.post('/', async (request, response, next) => {
  const { body } = request;
  const passwordHash = await bcrypt.hash(body.password, 10);
  const usernameTaken = await User.find({ username: body.username });
  const usernameAndPasswordTrue = (body.username && body.password);
  if (usernameTaken.length > 0) {
    return response.status(400).json({ error: 'username taken' });
  }
  if (usernameAndPasswordTrue && (body.username.length < 4 || body.password.length < 4)) {
    return response.status(400).json({ error: 'username or password too short' });
  }

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash,
    blogs: body.blogs,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, author: 1 });
  response.json(users);
});

module.exports = usersRouter;
