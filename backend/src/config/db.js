const mongoose = require('mongoose')
const logger = require('./logger')
const { MongoMemoryServer } = require('mongodb-memory-server')

let memoryServer

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_management'
  mongoose.set('strictQuery', true)
  try {
    await mongoose.connect(uri)
    logger.info('MongoDB connected')
  } catch (err) {
    logger.warn(`MongoDB connection failed: ${err.message}`)
    logger.warn('Starting in-memory MongoDB for development')
    memoryServer = await MongoMemoryServer.create()
    const memUri = memoryServer.getUri()
    await mongoose.connect(memUri)
    logger.info('In-memory MongoDB connected')
  }
}

module.exports = { connectDB }
