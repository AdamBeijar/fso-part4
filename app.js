const express = require('express')
const config = require('./utils/config')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const BlogsRouter = require('./controllers/blogs')
const UserRouter = require('./controllers/users')
const LoginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

mongoose.set("strictQuery", false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(() => {
    logger.info('connected to MongoDB')
}).catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
})
app.use(middleware.tokenExtractor)

app.use('/api/blogs', BlogsRouter)
app.use('/api/users', UserRouter)
app.use('/api/login', LoginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
