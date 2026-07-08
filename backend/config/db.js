const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-core');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not configured');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }

    console.log('Falling back to in-memory MongoDB for local development.');

    try {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB in-memory server started at ${conn.connection.host}`);
    } catch (memError) {
      console.error(`In-memory MongoDB startup error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
