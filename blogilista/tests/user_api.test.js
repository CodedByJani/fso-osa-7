const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({ username: 'root', name: 'Testaaja', passwordHash })
  await user.save()
})

describe('creating a new user', () => {
  test('fails if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Lyhyt nimi',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('username must be at least')
  })

  test('fails if password is too short', async () => {
    const newUser = {
      username: 'validname',
      name: 'Testi',
      password: 'pw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('password must be at least')
  })

  test('fails if username already exists', async () => {
    const newUser = {
      username: 'root',
      name: 'CopyCat',
      password: 'password123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('username must be unique')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
