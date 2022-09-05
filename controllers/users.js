/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */

const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
require('express-async-errors')

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const user = await User.findById(id)
    .populate('blogs', {
      title: 1,
      author: 1,
      content: 1,
      likes: 1,
      id: 1,
    })
    .populate('likedBlogs', {
      title: 1,
      author: 1,
      id: 1,
    })
  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { body } = request
  if (!body.username || !body.password) {
    return response.status(400).json({ error: 'missing fields' })
  }
  const passwordHash = await bcrypt.hash(body.password, 10)
  const usernameTaken = await User.find({ username: body.username })
  if (usernameTaken.length > 0) {
    return response.status(400).json({ error: 'taken' })
  }
  if (body.username.length < 4 || body.password.length < 4) {
    return response.status(400).json({ error: 'tooshort' })
  }

  const user = new User({
    username: body.username,
    passwordHash,
    blogs: body.blogs,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    content: 1,
    author: 1,
  })
  response.json(users)
})

module.exports = usersRouter
