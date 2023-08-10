const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')


blogsRouter.get('/', (request, response) => {
    logger.info("blogsRouter.get")
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
    console.log(request.body.test)
    const blog = new Blog({title: request.body.test})
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  
  module.exports = blogsRouter
  