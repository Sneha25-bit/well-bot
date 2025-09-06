const mongoose = require('mongoose');

// Test MongoDB connection
async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Common MongoDB Atlas connection issues
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set');
      return;
    }
    
    console.log('📍 MongoDB URI exists:', !!mongoUri);
    console.log('📍 URI format check:', mongoUri.startsWith('mongodb'));
    
    // Try to connect with more specific error handling
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    
    console.log('✅ MongoDB Connected successfully!');
    console.log('🎯 Connected to:', conn.connection.host);
    console.log('🗄️ Database name:', conn.connection.name);
    
    // Test a simple operation
    const adminDb = conn.connection.db.admin();
    const result = await adminDb.ping();
    console.log('🏓 Ping result:', result);
    
    await mongoose.disconnect();
    console.log('👋 Disconnected successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('🔍 Server selection failed - possible causes:');
      console.error('  - Wrong connection string');
      console.error('  - Network/firewall issues');
      console.error('  - IP not whitelisted');
      console.error('  - Wrong credentials');
    }
    
    if (error.name === 'MongoParseError') {
      console.error('🔍 Connection string parse error - check format');
    }
    
    if (error.name === 'MongoAuthenticationError') {
      console.error('🔍 Authentication failed - check username/password');
    }
  }
}

// Run the test
testConnection();
