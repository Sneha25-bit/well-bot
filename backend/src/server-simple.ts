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

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint (always works)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wellness Bot API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '5000'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Wellness Bot API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users', 
      chat: '/api/chat',
      medicines: '/api/medicines',
      period: '/api/period',
      healthPlans: '/api/health-plans'
    }
  });
});

// Initialize database and routes
async function initializeApp() {
  try {
    // Try to connect to database if MONGODB_URI exists
    if (process.env.MONGODB_URI) {
      console.log('🔄 Connecting to database...');
      const { default: connectDB } = await import('./config/database');
      await connectDB();
      
      console.log('🔄 Loading API routes...');
      const { default: routes } = await import('./routes');
      app.use('/api', routes);
      
      console.log('🔄 Loading error handlers...');
      const { errorHandler, notFound } = await import('./middleware/errorHandler');
      app.use(notFound);
      app.use(errorHandler);
      
      console.log('✅ Application fully initialized');
    } else {
      console.log('⚠️  MONGODB_URI not found - running in health-check-only mode');
      
      app.use('/api/*', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database not connected - only health check available',
          availableEndpoints: ['/api/health', '/']
        });
      });
      
      app.use('*', (req, res) => {
        res.status(404).json({
          success: false,
          message: 'Endpoint not found',
          availableEndpoints: ['/api/health', '/']
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    
    // In production, don't crash - just serve health checks
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Running in degraded mode - only health checks available');
      
      app.use('/api/*', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable',
          error: 'Database connection failed'
        });
      });
    } else {
      throw error; // Re-throw in development
    }
  }
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Initialize app after server starts
  initializeApp().catch(console.error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('❌ Unhandled Promise Rejection:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Handle uncaught exceptions  
process.on('uncaughtException', (err: Error) => {
  console.log('❌ Uncaught Exception:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    server.close(() => {
      process.exit(1);
    });
  }
});

export default app;
