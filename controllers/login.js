/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
require('dotenv').config()
require('express-async-errors')

loginRouter.post('/', async (request, response) => {
  const { body } = request
  const user = await User.findOne({ username: body.username })
  const correctPass =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && correctPass)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const tokenForUser = {
    username: body.username,
    id: user._id,
  }

  const token = jwt.sign(tokenForUser, process.env.SECRET)

  response.status(200).send({
    token,
    username: user.username,
    likedBlogs: user.likedBlogs,
    id: user._id,
  })
})

module.exports = loginRouter
