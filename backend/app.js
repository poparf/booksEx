const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const middleware = require('./utils/middlewares')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(() => {
    console.log('im here')
    logger.info('connected to mongodb')
}).catch(error => {
    logger.error('error connecting to mongodb', error.message)
})

app.use(cors())
app.use(express.json())

const blogRouter = require('./routes/blogRoutes')
app.use('/api/blog', blogRouter)

app.use(middleware.errorHandler)

module.exports = app