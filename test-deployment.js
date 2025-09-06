#!/usr/bin/env node

/**
 * Deployment Health Check Script
 * This script tests your backend and frontend connectivity
 */

const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test function for HTTP/HTTPS requests
function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 && json.success) {
            log('green', `✅ ${description}: OK (${responseTime}ms)`);
            resolve({ success: true, data: json, responseTime });
          } else {
            log('red', `❌ ${description}: Failed - ${json.message || 'Unknown error'}`);
            resolve({ success: false, error: json.message, statusCode: res.statusCode });
          }
        } catch (error) {
          log('red', `❌ ${description}: Invalid JSON response`);
          resolve({ success: false, error: 'Invalid JSON', data: data.substring(0, 200) });
        }
      });
    });
    
    req.on('error', (error) => {
      log('red', `❌ ${description}: Connection failed - ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      log('red', `❌ ${description}: Timeout (>10s)`);
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// Test login endpoint
function testLogin(baseUrl, email, password) {
  return new Promise((resolve) => {
    const url = `${baseUrl}/auth/login`;
    const postData = JSON.stringify({ email, password });
    
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 && json.success) {
            log('green', '✅ Login endpoint: OK');
          } else if (res.statusCode === 401) {
            log('yellow', '⚠️  Login endpoint: Working (invalid credentials expected)');
          } else {
            log('red', `❌ Login endpoint: ${json.message || 'Unexpected response'}`);
          }
          resolve({ success: res.statusCode === 200 || res.statusCode === 401, data: json });
        } catch (error) {
          log('red', '❌ Login endpoint: Invalid JSON response');
          resolve({ success: false, error: 'Invalid JSON' });
        }
      });
    });
    
    req.on('error', (error) => {
      log('red', `❌ Login endpoint: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

async function main() {
  log('blue', '🚀 Testing Wellness Bot Deployment');
  log('blue', '=====================================');
  
  // Get URLs from command line or use defaults
  const args = process.argv.slice(2);
  const backendUrl = args[0] || 'https://your-backend.onrender.com';
  const frontendUrl = args[1] || 'https://your-frontend.vercel.app';
  
  console.log(`Backend URL: ${backendUrl}`);
  console.log(`Frontend URL: ${frontendUrl}`);
  console.log('');
  
  // Test backend endpoints
  log('yellow', '🔍 Testing Backend...');
  
  const healthResult = await testEndpoint(`${backendUrl}/api/health`, 'Health Check');
  const rootResult = await testEndpoint(`${backendUrl}/`, 'Root Endpoint');
  const loginResult = await testLogin(`${backendUrl}/api`, 'test@example.com', 'wrongpassword');
  
  console.log('');
  
  // Test frontend
  log('yellow', '🔍 Testing Frontend...');
  const frontendResult = await testEndpoint(frontendUrl, 'Frontend');
  
  console.log('');
  
  // Summary
  log('blue', '📊 Summary');
  log('blue', '==========');
  
  const backendOK = healthResult.success && rootResult.success;
  const authOK = loginResult.success;
  const frontendOK = frontendResult.success;
  
  if (backendOK) {
    log('green', '✅ Backend is running');
  } else {
    log('red', '❌ Backend has issues');
  }
  
  if (authOK) {
    log('green', '✅ Authentication endpoints are working');
  } else {
    log('red', '❌ Authentication endpoints have issues');
  }
  
  if (frontendOK) {
    log('green', '✅ Frontend is accessible');
  } else {
    log('red', '❌ Frontend has issues');
  }
  
  if (backendOK && authOK && frontendOK) {
    log('green', '🎉 All systems operational! Your deployment looks good.');
    log('yellow', '💡 If you still can\'t sign in, check:');
    console.log('   - Environment variables in your deployment platform');
    console.log('   - Database connection (MongoDB)');
    console.log('   - CORS settings');
    console.log('   - Browser developer console for errors');
  } else {
    log('red', '⚠️  Issues detected. Please fix the failing components above.');
  }
}

// Show usage if no arguments provided
if (process.argv.length < 3) {
  console.log('Usage: node test-deployment.js <backend-url> [frontend-url]');
  console.log('');
  console.log('Example:');
  console.log('  node test-deployment.js https://wellness-bot-backend.onrender.com https://wellness-bot-frontend.vercel.app');
  console.log('');
  console.log('Testing with placeholder URLs...');
  console.log('');
}

main().catch(console.error);
