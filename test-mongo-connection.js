const { MongoClient } = require('mongodb');

// Your MongoDB connection string
const uri = "mongodb+srv://admin:kaBbTO1bCcZSINNS@well-bot.poaiych.mongodb.net/?retryWrites=true&w=majority&appName=well-bot";

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  console.log('📍 URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    
    // Test the connection
    console.log('✅ Successfully connected to MongoDB!');
    
    // List databases to verify access
    const dbs = await client.db().admin().listDatabases();
    console.log('📚 Available databases:');
    dbs.databases.forEach(db => console.log(`  - ${db.name}`));
    
    // Test creating a simple document
    const db = client.db('wellness-bot');
    const collection = db.collection('test');
    
    const testDoc = { message: 'Hello from connection test!', timestamp: new Date() };
    const result = await collection.insertOne(testDoc);
    console.log('✅ Test document inserted with ID:', result.insertedId);
    
    // Clean up test document
    await collection.deleteOne({ _id: result.insertedId });
    console.log('🗑️ Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔑 Authentication error - check username/password');
    }
    if (error.message.includes('network')) {
      console.error('🌐 Network error - check IP whitelist in MongoDB Atlas');
    }
    
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

testConnection();
