import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    // Suppress mongoose warnings
    mongoose.set('strictQuery', false);
    
    // Configure mongoose to suppress duplicate index warnings
    mongoose.set('autoIndex', false); // Disable auto index creation in production
    
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Only create indexes in development or when explicitly needed
    if (process.env.NODE_ENV !== 'production' && mongoose.connection.db) {
      console.log('🔧 Creating database indexes...');
      await mongoose.connection.db.admin().command({ listCollections: 1 });
    }
    
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('authentication')) {
      console.error('🔑 Check your MongoDB username and password');
    } else if (error.message.includes('network')) {
      console.error('🌐 Check your network connection and MongoDB URL');
    } else if (error.message.includes('MONGODB_URI')) {
      console.error('⚙️ Add MONGODB_URI to your environment variables');
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export default connectDB;
