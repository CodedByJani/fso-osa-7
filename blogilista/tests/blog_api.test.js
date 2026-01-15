const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Testiblogi 1',
    author: 'Kirjoittaja 1',
    url: 'http://esimerkki1.com',
    likes: 3,
  },
  {
    title: 'Testiblogi 2',
    author: 'Kirjoittaja 2',
    url: 'http://esimerkki2.com',
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
}, 20000)

test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(initialBlogs.length)
}, 20000)

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]

  expect(blog.id).toBeDefined()
}, 20000)

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Uusi blogi',
    author: 'Testaaja',
    url: 'http://testiblogi.com',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('Uusi blogi')
}, 20000)

test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'No Likes Author',
    url: 'http://nolikes.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title Author',
    url: 'http://notitle.com',
    likes: 1,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'No URL Author',
    likes: 1,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)
})

test('a blog can update its likes', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedData = {
    likes: blogToUpdate.likes + 10,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(updatedData.likes)
})

afterAll(async () => {
  await mongoose.connection.close()
})
