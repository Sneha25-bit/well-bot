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
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
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
      root: '/'
    },
    databaseStatus: process.env.MONGODB_URI ? 'Will attempt connection' : 'Not configured'
  });
});

// Catch-all for other API routes (before database is connected)
app.get('/api/*', (req, res) => {
  res.status(503).json({
    success: false,
    message: 'API endpoints are initializing. Please try again in a moment.',
    availableNow: ['/api/health', '/']
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
  
  try {
    // Check if we have database connection string
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not found - running without database');
      console.log('✅ Server ready (health-check mode only)');
      return;
    }

    console.log('🔗 Connecting to database...');
    
    // Import and connect to database
    const { default: connectDB } = await import('./config/database');
    await connectDB();
    
    console.log('📚 Loading API routes...');
    
    // Import routes
    const { default: routes } = await import('./routes');
    
    // Remove the temporary catch-all handler
    app._router.stack = app._router.stack.filter((layer: any) => {
      return !(layer.route && layer.route.path === '/api/*');
    });
    
    // Add real routes
    app.use('/api', routes);
    
    console.log('🛡️  Loading error handlers...');
    const { errorHandler, notFound } = await import('./middleware/errorHandler');
    app.use(notFound);
    app.use(errorHandler);
    
    console.log('✅ Full application initialized successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('⚠️  Continuing in health-check mode...');
    
    // Add fallback routes for when database fails
    app.use('/api/*', (req, res) => {
      res.status(503).json({
        success: false,
        message: 'Database connection failed - service running in limited mode',
        error: 'Database unavailable',
        availableEndpoints: ['/api/health', '/']
      });
    });
    
    console.log('✅ Server ready (limited mode - health checks only)');
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
