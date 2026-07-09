const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not set in .env — cannot connect to MongoDB.');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
