//const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog.js')
const User = require('../models/user')

const api = supertest(app)

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {

  await Blog.deleteMany({})
  const blogObjects = blogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  await User.deleteMany({})
  await api.post('/api/users').send({'username': 'post test', 'name': 'post test', 'password': 'test'})
})

test('HTTP GET to /api/blogs returns correct amount of blogs', async () => {

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(6)
  expect(response.headers['content-type']).toContain('application/json')
})

test('Blogs identifier is named id', async () => {

  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

describe('addition of a new blog', () => {

  test('HTTP POST to /api/blogs with no token fails with status 401', async () => {
    const testBlog = {
      title: 'Test title',
      author: 'Test T. Testing',
      url: 'http://blog.cleancoder.com/test/TypeWars.html',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(401)
  })

  test('HTTP POST to /api/blogs creates a new blog', async () => {

    const testBlog = {
      title: 'Test title',
      author: 'Test T. Testing',
      url: 'http://blog.cleancoder.com/test/TypeWars.html',
      likes: 5,
    }

    const token = await (await api.post('/api/login').send({'username': 'post test', 'password': 'test'})).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(201)

    const response = await api.get('/api/blogs')

    const blogTitles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(blogs.length + 1)
    expect(blogTitles).toContain('Test title')
  })

  test('Default value for likes is 0', async () => {

    await Blog.deleteMany({})

    const testBlog = {
      title: 'Test title',
      author: 'Test T. Testing',
      url: 'http://blog.cleancoder.com/test/TypeWars.html',
    }
  
    const token = await (await api.post('/api/login').send({'username': 'post test', 'password': 'test'})).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(201)
  
    const response = await api.get('/api/blogs')

    expect(response.body[0].likes).toBe(0)
  })

  test('HTTP POST to /api/blogs without title return status code 400', async () => {

    const testBlog = {
      author: 'Test T. Testing',
      url: 'http://blog.cleancoder.com/test/TypeWars.html',
      likes: 5,
    }

    const token = await (await api.post('/api/login').send({'username': 'post test', 'password': 'test'})).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(400)
  
  })

  test('HTTP POST to /api/blogs without url return status code 400', async () => {

    const testBlog = {
      title: 'Test title',
      author: 'Test T. Testing',
      likes: 5,
    }
    const token = await (await api.post('/api/login').send({'username': 'post test', 'password': 'test'})).body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(400)
    
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {

    const testBlog = {
      title: 'Test title',
      author: 'Test T. Testing',
      url: 'http://blog.cleancoder.com/test/TypeWars.html',
      likes: 5,
    }

    const token = await (await api.post('/api/login').send({'username': 'post test', 'password': 'test'})).body.token

    const blog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(201)

    await api
      .delete(`/api/blogs/${blog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  
    const blogsAfterDelete = await api.get('/api/blogs')
    const titlesAfterDelete = blogsAfterDelete.body.map(r => r.title)
    expect(titlesAfterDelete).not.toContain('Test title')
  })
})

describe('updating blog', () => {
  test('adding a like to a blog changes likes', async () => {

    const updatedBlog = { ...blogs[0]}
    const title = blogs[0].title
    updatedBlog.likes = updatedBlog.likes + 1
    await api
      .put(`/api/blogs/${blogs[0]._id}`)
      .send(updatedBlog)
      
    const blogsAfterUpdate = await api.get('/api/blogs')
    const blogWithCorrectTitle = blogsAfterUpdate.body.find(blog => blog.title == title)
    expect(blogWithCorrectTitle.likes).toBe(blogs[0].likes + 1)
  })

  test('title changes title', async () => {

    const updatedBlog = { ...blogs[0]}
    updatedBlog.title = 'updated title'
    await api
      .put(`/api/blogs/${blogs[0]._id}`)
      .send(updatedBlog)
      
    const blogsAfterUpdate = await api.get('/api/blogs')
    const titlesAfterUpdate= blogsAfterUpdate.body.map(r => r.title)
    expect(titlesAfterUpdate).toContain('updated title')
  })
})
  