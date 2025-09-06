# 🏥 Wellness Bot - Complete MERN Stack Application

A comprehensive health and wellness management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌟 Overview
Smart Health Companion is a conversational AI web app that makes healthcare guidance **accessible, personalized, and proactive**.  
It provides instant health advice, tracks symptoms, gives personalized action plans, and supports emergencies with an AI-powered first aid coach.  

This project was built during a hackathon under the **Open Innovation** theme, with the goal of making health support available for everyone, 24/7.  

---

## 🚨 Why This Matters
- 🌍 Limited access to doctors, especially in rural or urgent situations  
- ❌ Misinformation from random Google searches  
- 🕒 No instant, reliable, and personalized health advice  
- 📅 Missed medicines and lack of wellness tracking  

Smart Health Companion solves these problems with **AI-driven guidance, reminders, and action plans**.  

---

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT tokens
- Email verification and password reset
- Protected routes and secure API endpoints
- User profile management with health data

### 🤖 AI-Powered Chat System
- Intelligent health conversations
- Session management and message history
- Quick actions and health suggestions
- Context-aware responses

### 💊 Medicine Management
- Add, edit, and delete medications
- Set custom reminders and schedules
- Mark medicines as taken with timestamps
- AI-suggested medication tracking

### 📊 Health Dashboard
- Real-time health statistics
- Quick access to all features
- Personalized health insights
- Progress tracking

### 👤 Health Profile
- Complete medical history tracking
- Allergies, medications, and chronic conditions
- Emergency contact management
- App preferences and settings

### 📅 Period Tracking (Female Users)
- Menstrual cycle tracking and predictions
- Symptom and mood logging
- Health insights and analytics
- Fertility predictions

### 📋 Personalized Health Plans
- AI-generated health recommendations
- Task management and tracking
- Progress monitoring
- Goal setting and achievement

### 🚨 First Aid & Emergency
- Quick access to emergency information
- Emergency contact integration
- Health alerts and notifications

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
./start.sh
```

### Option 2: Manual Setup

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd well-bot
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your MongoDB URI and settings
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   cp env.example .env
   npm install
   npm run dev
   ```

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication with refresh tokens
- **bcrypt** for password hashing
- **Nodemailer** for email services
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Router** for navigation
- **Axios** for API communication
- **React Query** for data fetching
- **Lucide React** for icons

### Database
- **MongoDB** with comprehensive schemas for:
  - Users with health profiles
  - Chat sessions and messages
  - Medicine tracking and reminders
  - Period cycles and predictions
  - Health plans and tasks
  - Emergency contacts

## 📁 Project Structure

```
well-bot/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── utils/          # Email, AI services
│   │   └── config/         # Database configuration
│   ├── package.json
│   └── env.example
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript definitions
│   │   └── hooks/          # Custom React hooks
│   ├── package.json
│   └── env.example
├── start.sh               # Quick setup script
├── INTEGRATION_GUIDE.md   # Detailed setup guide
└── README.md             # This file
```

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

## 📚 API Documentation

### Authentication Endpoints
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

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- Secure headers with Helmet
- Protected routes and API endpoints

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

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```
**Built with ❤️ for better health and wellness management**

