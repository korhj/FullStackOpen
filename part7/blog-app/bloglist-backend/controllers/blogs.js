const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");
const logger = require("../utils/logger");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  logger.info("blogsRouter.get");
  const returnedBlogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(returnedBlogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blogWithId = await Blog.findById(request.params.id);
  response.json(blogWithId);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  if (!body.title) {
    logger.error("Title is required");
    return response.status(400).json("Title is required");
  }
  if (!body.url) {
    logger.error("URL is required");
    return response.status(400).json("URL is required");
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(400).json({ error: "blog not found" });
    }

    const user = request.user;
    console.log(user, blog);
    if (!(blog.user.toString() === user.id.toString())) {
      return response.status(401).json({ error: "token invalid" });
    }

    console.log("deleting", request.params.id);
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  },
);

module.exports = blogsRouter;
