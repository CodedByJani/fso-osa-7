const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

const usersRouter = require('./routes/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const tokenExtractor = require('./middleware/tokenExtractor')

const testingRouter = require('./controllers/testing')

const app = express()

const mongoUrl = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

module.exports = app

