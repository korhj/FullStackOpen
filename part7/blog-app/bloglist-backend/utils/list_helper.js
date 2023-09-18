const _ = require("lodash");

const dummy = (blogs) => {
  blogs;
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce(
    (acc, curr) => (acc.likes < curr.likes ? curr : acc),
    blogs[0],
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const blogsPerAuthor = _.countBy(blogs, "author");
  const mostBlogs = _.maxBy(
    _.keys(blogsPerAuthor),
    (index) => blogsPerAuthor[index],
  );

  return {
    author: mostBlogs,
    blogs: blogsPerAuthor[mostBlogs],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const groupedByAuthor = _.groupBy(blogs, "author");
  const likesPerAuthor = _.map(groupedByAuthor, (blogs, author) => ({
    author: author,
    likes: blogs.reduce((acc, curr) => acc + curr.likes, 0),
  }));
  const mostLikes = _.maxBy(likesPerAuthor, "likes");
  return mostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
