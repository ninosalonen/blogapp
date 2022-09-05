const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const testingRouter = require('./controllers/devRouter')
const middleware = require('./utils/middleware')
const path = require('path')

const app = express()

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MONGODB')
  })
  .catch((error) => {
    console.error('Error connecting', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtract)

app.use(express.static(path.join(__dirname, 'client', 'build')))

app.use('/api/blogs/', blogsRouter)
app.use('/api/users/', usersRouter)
app.use('/api/login/', loginRouter)

app.use('*', async (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
