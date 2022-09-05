const router = require('express').Router()
const Note = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (_request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
