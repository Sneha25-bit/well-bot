// Patch to add debug endpoint to your existing server
const fs = require('fs');
const path = require('path');

console.log('📝 Adding debug endpoint to server...');

const serverFile = path.join(__dirname, 'src', 'server.ts');
let serverContent = fs.readFileSync(serverFile, 'utf8');

// Add debug endpoint after the test endpoint
const debugEndpoint = `

// Debug endpoint for MongoDB connection issues
app.get('/api/debug', async (req, res) => {
  console.log('🔍 Debug endpoint requested');
  
  const debug = {
    success: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoUri: {
      exists: !!process.env.MONGODB_URI,
      startsWithMongodb: process.env.MONGODB_URI?.startsWith('mongodb'),
      containsAtlasCloud: process.env.MONGODB_URI?.includes('mongodb.net'),
      hasCredentials: process.env.MONGODB_URI?.includes('@'),
    },
    connectionTest: null
  };
  
  // Try to connect to MongoDB and get detailed error
  if (process.env.MONGODB_URI) {
    try {
      console.log('🧪 Testing MongoDB connection...');
      const mongoose = await import('mongoose');
      
      // Test connection with timeout
      const conn = await mongoose.default.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        maxPoolSize: 1
      });
      
      debug.connectionTest = {
        success: true,
        host: conn.connection.host,
        database: conn.connection.name,
        readyState: conn.connection.readyState
      };
      
      await mongoose.default.disconnect();
      
    } catch (error) {
      debug.connectionTest = {
        success: false,
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.code,
        errorCodeName: error.codeName
      };
    }
  }
  
  res.json(debug);
});`;

// Insert the debug endpoint after the test endpoint
const testEndpointEnd = serverContent.indexOf('});', serverContent.indexOf('/api/test'));
const insertPosition = serverContent.indexOf('\n', testEndpointEnd) + 1;

const newContent = serverContent.slice(0, insertPosition) + debugEndpoint + serverContent.slice(insertPosition);

fs.writeFileSync(serverFile, newContent);
console.log('✅ Debug endpoint added successfully!');
console.log('🚀 Committing and pushing changes...');
