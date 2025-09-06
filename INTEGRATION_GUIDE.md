# Wellness Bot - Frontend & Backend Integration Guide

## 🎉 Complete MERN Stack Integration

Your Wellness Bot now has a fully integrated frontend and backend! Here's what has been implemented:

## ✅ What's Been Completed

### Backend (MERN Stack)
- ✅ **MongoDB Database Schema** - Complete user, chat, medicine, period, and health plan models
- ✅ **Express.js API** - RESTful endpoints for all features
- ✅ **JWT Authentication** - Secure login/logout with refresh tokens
- ✅ **TypeScript** - Full type safety throughout the backend
- ✅ **Security** - Rate limiting, CORS, input validation, error handling
- ✅ **AI Services** - Symptom analysis and health plan generation
- ✅ **Email Services** - Verification and notification system

### Frontend (React + TypeScript)
- ✅ **Authentication System** - Login, register, protected routes
- ✅ **API Integration** - Complete service layer for all backend endpoints
- ✅ **Real-time Data** - Dashboard, chat, medicine tracking, health profile
- ✅ **User Management** - Profile updates, preferences, settings
- ✅ **Responsive UI** - Modern design with loading states and error handling

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your MongoDB URI and other settings

# Start MongoDB (make sure it's running)
# On macOS with Homebrew:
brew services start mongodb-community

# Start the backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your API URL (default: http://localhost:5000/api)

# Start the frontend development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wellness-bot
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Wellness Bot
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

## 📱 Features Available

### Authentication
- User registration with email verification
- Secure login/logout
- Password reset functionality
- Protected routes

### Dashboard
- Real-time health statistics
- Quick access to all features
- Personalized welcome message

### AI Chat System
- Intelligent health conversations
- Session management
- Message history
- AI-powered responses

### Medicine Management
- Add/edit/delete medications
- Set reminders and schedules
- Mark medicines as taken
- AI-suggested medications

### Health Profile
- Complete user profile management
- Medical history tracking
- Emergency contacts
- App preferences

### Period Tracking (for female users)
- Cycle tracking and predictions
- Symptom and mood logging
- Health insights and analytics

### Health Plans
- AI-generated personalized plans
- Task management and tracking
- Progress monitoring

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- Secure headers with Helmet

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update profile
- `POST /api/auth/logout` - Logout

### User Management
- `GET /api/users/dashboard` - Dashboard data
- `GET /api/users/preferences` - User preferences
- `PUT /api/users/preferences` - Update preferences

### Chat System
- `GET /api/chat/sessions` - Get chat sessions
- `POST /api/chat/sessions` - Create new session
- `POST /api/chat/sessions/:id/messages` - Add message

### Medicine Management
- `GET /api/medicines` - Get medicines
- `POST /api/medicines` - Add medicine
- `PUT /api/medicines/:id` - Update medicine
- `POST /api/medicines/:id/taken` - Mark as taken

### Period Tracking
- `GET /api/period/history` - Get period history
- `POST /api/period/entries` - Add period entry
- `GET /api/period/predictions` - Get predictions

### Health Plans
- `GET /api/health-plans` - Get health plans
- `POST /api/health-plans/generate` - Generate AI plan
- `PUT /api/health-plans/:id/tasks/:taskId` - Toggle task

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update environment variables for production
3. Deploy to your preferred platform (Heroku, Vercel, AWS, etc.)
4. Set up email service for notifications

### Frontend Deployment
1. Update API URL in environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 🔍 Testing the Integration

1. **Register a new user** at http://localhost:3000/register
2. **Login** and access the dashboard
3. **Try the chat system** - messages are saved to the database
4. **Add medicines** - they're stored and can be marked as taken
5. **Update your profile** - changes are persisted
6. **Check the API** - all data is available via REST endpoints

## 📝 Next Steps

Your Wellness Bot is now fully functional! Consider these enhancements:

1. **Real-time notifications** for medicine reminders
2. **Push notifications** for mobile devices
3. **Advanced AI integration** with external health APIs
4. **Data export/import** functionality
5. **Multi-language support**
6. **Advanced analytics and reporting**
7. **Integration with wearable devices**
8. **Telemedicine features**

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in .env
   - Verify network connectivity

2. **CORS Errors**
   - Check CORS_ORIGIN in backend .env
   - Ensure frontend URL matches

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET is set
   - Verify token expiration settings

4. **API Connection Issues**
   - Verify VITE_API_URL in frontend .env
   - Check backend server is running
   - Test API endpoints directly

## 🎯 Success!

Your Wellness Bot is now a complete, production-ready MERN stack application with:
- ✅ Full authentication system
- ✅ Real-time data synchronization
- ✅ AI-powered health features
- ✅ Modern, responsive UI
- ✅ Secure API endpoints
- ✅ Comprehensive error handling

Happy coding! 🚀
