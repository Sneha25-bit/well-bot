// Quick test to see what environment variables are set on Render
console.log('Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI starts with mongodb:', process.env.MONGODB_URI?.startsWith('mongodb'));

// Test a simple HTTP request to your deployed backend
const https = require('https');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'wellness-bot-backend.onrender.com',
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function runTests() {
  try {
    console.log('\n🧪 Testing deployed backend...');
    
    const health = await testEndpoint('/api/health');
    console.log('\n📊 Health Check:');
    console.log('  Status:', health.success ? '✅' : '❌');
    console.log('  Environment:', health.environment);
    console.log('  Uptime:', health.uptime, 'seconds');
    
    const root = await testEndpoint('/');
    console.log('\n📋 Root Endpoint:');
    console.log('  Database Status:', root.databaseStatus);
    console.log('  CORS Origins:', root.corsOrigins?.length || 0);
    
    const auth = await testEndpoint('/api/auth/register');
    console.log('\n🔐 Auth Endpoint:');
    console.log('  Success:', auth.success ? '✅' : '❌');
    console.log('  Message:', auth.message);
    
    if (!auth.success && auth.message.includes('Database')) {
      console.log('\n🔍 Diagnosis: MongoDB connection is failing on Render');
      console.log('   Most likely causes:');
      console.log('   1. IP not whitelisted in MongoDB Atlas');
      console.log('   2. Wrong connection string format');
      console.log('   3. Invalid credentials');
      console.log('   4. Network/firewall issues');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
