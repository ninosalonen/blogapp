/* eslint-disable array-callback-return */

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'eka',
    author: 'testi',
    url: 'www.facebook.fi',
  },
];

const testBlogs = [
  {
    title: 'moii',
    author: 'nino2',
    url: 'www.google.fi',
    likes: 7,
  },
  {
    title: 'moii2',
    author: 'nino2',
    url: 'www.twitter.com',
    likes: 10,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('fetch', async () => {
  await api.get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('confirm id', async () => {
  const response = await api.get('/api/blogs');
  response.body.map((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test('post test', async () => {
  const initial = (await api.get('/api/blogs/')).body;
  expect(initial.length).toBe(1);
  await Blog.insertMany(testBlogs);
  const newBlogs = (await api.get('/api/blogs/')).body;
  expect(newBlogs.length).toBe(3);
  expect(newBlogs[2].url).toContain('twitter');
});

test('if no likes', async () => {
  const initial = (await api.get('/api/blogs/')).body;
  expect(initial[0].likes).toBeDefined();
  expect(initial[0].likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
