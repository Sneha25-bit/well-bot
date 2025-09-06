import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const app = express();

// Basic middleware that doesn't require database
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

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

// Health check endpoint (works without database)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wellness Bot API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
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
      auth: '/api/auth',
      users: '/api/users',
      chat: '/api/chat',
      medicines: '/api/medicines',
      period: '/api/period',
      healthPlans: '/api/health-plans'
    }
  });
});

// Initialize database and routes only if not in build mode
const initializeApp = async () => {
  try {
    // Only connect to database if MONGODB_URI is available
    if (process.env.MONGODB_URI) {
      console.log('🔄 Initializing database connection...');
      const connectDB = await import('./config/database');
      await connectDB.default();
      
      console.log('🔄 Loading routes...');
      const routes = await import('./routes');
      app.use('/api', routes.default);
      
      console.log('🔄 Loading error handlers...');
      const { errorHandler, notFound } = await import('./middleware/errorHandler');
      app.use(notFound);
      app.use(errorHandler);
      
    } else {
      console.log('⚠️  MONGODB_URI not found - running in minimal mode');
      
      // Minimal error handler for health checks
      app.use('*', (req, res) => {
        res.status(404).json({
          success: false,
          message: 'Endpoint not found - Database not connected'
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
    // Don't exit in production, just serve health checks
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Initialize app after server starts
  await initializeApp();
  
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Promise Rejection:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log('Uncaught Exception:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

export default app;
