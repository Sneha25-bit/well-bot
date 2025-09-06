import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🚀 Starting Wellness Bot API...');
console.log('📍 Node Version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 5000);

const app = express();

// Basic middleware setup
console.log('⚙️  Setting up middleware...');

app.use(helmet());
// Configure CORS origins - support multiple origins
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173']; // fallback for development

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', corsOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

console.log('✅ Middleware setup complete');

// Health check endpoint - ALWAYS works
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({
    success: true,
    message: 'Wellness Bot API is running perfectly!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '5000',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    status: 'healthy'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('📋 Root endpoint requested');
  res.status(200).json({
    success: true,
    message: 'Welcome to Wellness Bot API! 🤖💊',
    version: '1.0.0',
    status: 'Server is running',
    documentation: '/api/health',
    availableEndpoints: {
      health: '/api/health',
      test: '/api/test',
      root: '/'
    },
    databaseStatus: process.env.MONGODB_URI ? 'Will attempt connection' : 'Not configured',
    corsOrigins: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*']
  });
});

// Debug endpoint for MongoDB connection issues
app.get('/api/debug', async (req, res) => {
  console.log('🔍 Debug endpoint requested');
  
  const debug: {
    success: boolean;
    timestamp: string;
    environment: string | undefined;
    mongoUri: {
      exists: boolean;
      startsWithMongodb: boolean | undefined;
      containsAtlasCloud: boolean | undefined;
      hasCredentials: boolean | undefined;
    };
    connectionTest: {
      success: boolean;
      host?: string;
      database?: string;
      readyState?: number;
      errorName?: string;
      errorMessage?: string;
      errorCode?: any;
      errorCodeName?: any;
    } | null;
  } = {
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
      
    } catch (error: any) {
      debug.connectionTest = {
        success: false,
        errorName: error?.name || 'Unknown',
        errorMessage: error?.message || 'Unknown error',
        errorCode: error?.code,
        errorCodeName: error?.codeName
      };
    }
  }
  
  res.json(debug);
});

// Test endpoint (always works, no database required)
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint requested');
  res.status(200).json({
    success: true,
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'],
    databaseConfigured: !!process.env.MONGODB_URI
  });
});

// Catch-all for other API routes (before database is connected)
app.use('/api/*', (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Database connection required. API endpoints are initializing...',
    error: 'Database unavailable',
    availableEndpoints: ['/api/health', '/']
  });
});

const PORT = process.env.PORT || 5000;

// Start server first, then try to initialize database
const server = app.listen(PORT, () => {
  console.log(`🎉 Server successfully started on port ${PORT}!`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API root: http://localhost:${PORT}/`);
  
  // Now try to initialize database and routes (but don't crash if it fails)
  initializeDatabase();
});

async function initializeDatabase() {
  console.log('🔄 Attempting to initialize database and routes...');
  
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check if we have database connection string
      if (!process.env.MONGODB_URI) {
        console.log('⚠️  MONGODB_URI not found - running without database');
        console.log('✅ Server ready (health-check mode only)');
        return;
      }

      console.log(`🔗 Connecting to database... (Attempt ${attempt}/${maxRetries})`);
      console.log('📍 MongoDB URI exists:', !!process.env.MONGODB_URI);
      
      // Import and connect to database
      const { default: connectDB } = await import('./config/database');
      await connectDB();
      
      console.log('📚 Loading API routes...');
      
      // Import routes
      const { default: routes } = await import('./routes');
      
      // Remove the temporary catch-all handler
      const routeStack = app._router?.stack || [];
      app._router.stack = routeStack.filter((layer: any) => {
        return !(layer.regexp && layer.regexp.toString().includes('/api/'));
      });
      
      // Add real routes
      app.use('/api', routes);
      
      console.log('🛡️  Loading error handlers...');
      const { errorHandler, notFound } = await import('./middleware/errorHandler');
      app.use(notFound);
      app.use(errorHandler);
      
      console.log('✅ Full application initialized successfully!');
      return; // Success - exit the retry loop
      
    } catch (error) {
      console.error(`❌ Database initialization failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.log('⚠️  All retry attempts failed. Starting with limited functionality...');
        await loadFallbackRoutes();
      }
    }
  }
}

async function loadFallbackRoutes() {
  try {
    console.log('📚 Loading fallback routes without database dependency...');
    
    // Create basic auth endpoints that don't require database
    app.post('/api/auth/register', (req, res) => {
      res.status(503).json({
        success: false,
        message: 'Registration temporarily unavailable - database connection required',
        error: 'Database unavailable'
      });
    });
    
    app.post('/api/auth/login', (req, res) => {
      res.status(503).json({
        success: false,
        message: 'Login temporarily unavailable - database connection required',
        error: 'Database unavailable'
      });
    });
    
    // Generic fallback for other API routes
    app.use('/api/*', (req, res) => {
      res.status(503).json({
        success: false,
        message: 'API endpoint temporarily unavailable - database connection required',
        error: 'Database unavailable',
        endpoint: req.path,
        availableEndpoints: ['/api/health', '/']
      });
    });
    
    console.log('✅ Fallback routes loaded');
    
  } catch (error) {
    console.error('❌ Failed to load fallback routes:', error);
  }
}

// Handle 404s for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedPath: req.path,
    availableEndpoints: ['/api/health', '/']
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received - shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received - shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle errors but don't crash in production
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

console.log('🎯 Server initialization complete - waiting for requests...');

export default app;
// Force redeploy Sun Sep  7 03:40:31 IST 2025
