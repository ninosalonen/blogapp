const tester = require('../utils/for_testing');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 22,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 22,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

test('dummy returns 1', () => {
  const result = tester.dummy(blogs);
  expect(result).toBe(1);
});

test('blog likes', () => {
  const result = tester.bloglikes(blogs);
  expect(result).toBe(58);
});

test('blog with 1', () => {
  const result = tester.bloglikes([blogs[0]]);
  expect(result).toBe(7);
});

describe('maxlikes, different blogs', () => {
  test('maxlikes', () => {
    const result = tester.maxlikes(blogs);
    expect(result).toEqual({ title: 'Canonical string reduction', likes: 22 });
  });
});

describe('most blogs', () => {
  test('author and blogs', () => {
    const result = tester.mostblogs(blogs);
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 });
  });
});

describe('most likes', () => {
  test('author and likes', () => {
    const result = tester.mostlikes(blogs);
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 27 });
  });
});
