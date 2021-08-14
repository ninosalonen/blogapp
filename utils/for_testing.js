/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */

const lodash = require('lodash');

const dummy = (blogs) => 1;

const bloglikes = (blogs) => {
  if (blogs.length > 1) {
    let sum = 0;
    blogs.map((blog) => {
      sum += blog.likes;
    });
    return (
      sum
    );
  }
  return blogs[0].likes;
};

const maxlikes = (blogs) => {
  let index = 0;
  let maxLikes = 0;
  if (blogs.length > 1) {
    blogs.map((blog, i) => {
      if (blog.likes > maxLikes) {
        maxLikes = blog.likes;
        index = i;
      }
    });
  }
  return (
    {
      title: blogs[index].title,
      likes: blogs[index].likes,
    }
  );
};

const mostblogs = (blogs) => {
  const amounts = lodash.countBy(blogs, 'author');
  const values = Object.values(amounts);
  const keys = Object.keys(amounts);
  const maximum = Math.max(...values);
  const maxIndex = values.indexOf(maximum);
  return (
    {
      author: keys[maxIndex],
      blogs: maximum,
    }
  );
};

const mostlikes = (blogs) => {
  const summedLikes = lodash(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: lodash.sumBy(objs, 'likes'),
    }))
    .value();
  let maxLikes = -1;
  let maxAuthor = '';
  summedLikes.map((author) => {
    if (author.likes > maxLikes) {
      maxLikes = author.likes;
      maxAuthor = author.author;
    }
  });
  return ({ author: maxAuthor, likes: maxLikes });
};

module.exports = {
  dummy,
  bloglikes,
  maxlikes,
  mostblogs,
  mostlikes,
};
