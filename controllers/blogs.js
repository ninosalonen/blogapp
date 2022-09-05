/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')
require('dotenv').config()

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({})
    .sort({ likes: -1 })
    .select({ author: 1, title: 1, likes: 1 })
    .populate('user', {
      username: 1,
      id: 1,
    })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  response.json(blog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { token, body } = request
  const id = request.params.id
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = await jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  if (body.comment.length < 1) {
    return response.status(400).json({ error: 'Comment was too short' })
  }
  const blog = await Blog.findById(id)
  const comments = [...blog.comments, body.comment]
  const newBlog = await Blog.findByIdAndUpdate(id, { comments })
  const blogToReturn = {
    ...newBlog._doc,
    id: newBlog._doc._id,
    comments: [...newBlog._doc.comments, body.comment],
  }
  return response.status(201).json(blogToReturn)
})

blogsRouter.post('/', async (request, response) => {
  const { token } = request
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = await jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const confirmedUser = await User.findById(decodedToken.id)

  const { body } = request

  const blog = new Blog({
    title: body.title,
    author: body.author,
    content: body.content,
    likes: 0,
    user: confirmedUser.id || confirmedUser._id,
    comments: [],
  })

  if (!blog.title || !blog.content) {
    response.status(400)
  }

  const savedBlog = await blog.save()
  const userToUpdate = { ...confirmedUser._doc }
  const blogs = [...userToUpdate.blogs, savedBlog._id]
  await User.findByIdAndUpdate(userToUpdate._id, { blogs })
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { token } = request
  const id = request.params.id
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const delBlog = await Blog.findById(id)
  if (!delBlog) {
    return response.status(404).json({ error: 'content not found' })
  }
  if (decodedToken.id !== delBlog.user.toString()) {
    return response.status(401).json({ error: 'not authorized to delete' })
  }
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { token } = request
  const id = request.params.id
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = await jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const confirmedUser = await User.findById(decodedToken.id)

  const alreadyLiked = confirmedUser.likedBlogs.filter(
    (blog) => blog.toString() === id
  )

  if (alreadyLiked.length < 1) {
    confirmedUser.likedBlogs.push(id)
    const toUpdate = await Blog.findById(id)
    const likes = toUpdate.likes + 1
    const updated = await Blog.findByIdAndUpdate(id, { likes })
    response.status(200).json(updated)
    await User.findByIdAndUpdate(confirmedUser._id, {
      likedBlogs: confirmedUser.likedBlogs,
    })
  } else {
    response.status(403).json({ error: 'already liked' })
  }
})

module.exports = blogsRouter
