const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
  logger.info('userRouter.get')
  const returnedUsers = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1})
  response.json(returnedUsers)

})

usersRouter.post('/', async (request, response) => {
  const { username, name, password} = request.body

  if(!password){
    logger.error('password is required')
    return response.status(400).json('password is required')
  }
  if(password.length < 3){
    logger.error('password must be at least 3 characters long')
    return response.status(400).json('password must be at least 3 characters long')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)


  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter