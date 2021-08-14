/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
require('express-async-errors');
require('dotenv').config();

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post('/:id/comments', async (request, response, next) => {
  const { body } = request;
  const blog = await Blog.findById(request.params.id);
  const comments = [...blog.comments, body.comment];
  const newBlog = await Blog.findByIdAndUpdate(request.params.id, { comments });
  return response.status(201).json(newBlog);
});

blogsRouter.post('/', async (request, response, next) => {
  const { token } = request;
  if (!token) {
    return response.status(401).json({ error: 'token missing' });
  }
  const decodedToken = await jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }
  const userr = await User.findById(decodedToken.id);

  const { body } = request;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userr._id,
    comments: [],
  });

  if (!blog.title || !blog.url) {
    response.status(400);
  }

  const savedBlog = await blog.save();
  const userToUpdate = { ...userr._doc };
  const blogs = [...userToUpdate.blogs, savedBlog._id];
  await User.findByIdAndUpdate(userToUpdate._id, { blogs });
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const { token } = request;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const delBlog = await Blog.findById(request.params.id);
  if (!delBlog) {
    return response.status(404).json({ error: 'content not found' });
  }
  if (decodedToken.id !== delBlog.user.toString()) {
    return response.status(401).json({ error: 'not authorized to delete' });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id/', async (request, response, next) => {
  const toUpdate = await Blog.findById(request.params.id);
  const likes = (toUpdate.likes + 1);
  const updated = await Blog.findByIdAndUpdate(request.params.id, { likes });
  response.status(200).json(updated);
});

module.exports = blogsRouter;
