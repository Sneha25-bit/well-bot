# Wellness Bot Backend API

A comprehensive MERN stack backend for the Wellness Bot application, providing health tracking, AI-powered recommendations, and user management features.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with refresh tokens
- 👤 **User Management**: Profile management, preferences, and health data
- 💬 **AI Chat System**: Intelligent health assistant with conversation history
- 💊 **Medicine Management**: Medication tracking, reminders, and compliance
- 📅 **Period Tracking**: Menstrual cycle tracking and predictions
- 📋 **Health Plans**: AI-generated personalized health action plans
- 📊 **Analytics**: Comprehensive health analytics and insights
- 🔒 **Security**: Rate limiting, CORS, helmet, and input validation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Email**: Nodemailer
- **File Upload**: Multer with Cloudinary

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:token` - Reset password
- `GET /api/auth/verifyemail/:token` - Verify email
- `GET /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update preferences
- `DELETE /api/users/account` - Delete account

### Chat
- `GET /api/chat/sessions` - Get chat sessions
- `GET /api/chat/sessions/:id` - Get specific session
- `POST /api/chat/sessions` - Create new session
- `POST /api/chat/sessions/:id/messages` - Add message
- `PUT /api/chat/sessions/:id` - Update session
- `DELETE /api/chat/sessions/:id` - Delete session
- `GET /api/chat/analytics` - Get chat analytics

### Medicines
- `GET /api/medicines` - Get medicines
- `GET /api/medicines/:id` - Get specific medicine
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `POST /api/medicines/:id/taken` - Mark as taken
- `GET /api/medicines/reminders` - Get reminders
- `GET /api/medicines/analytics` - Get analytics

### Period Tracking
- `GET /api/period/history` - Get period history
- `GET /api/period/current` - Get current cycle
- `GET /api/period/predictions` - Get predictions
- `GET /api/period/analytics` - Get analytics
- `POST /api/period/entries` - Add period entry
- `POST /api/period/cycles` - Start new cycle
- `PUT /api/period/cycles/:id/end` - End cycle

### Health Plans
- `GET /api/health-plans` - Get health plans
- `GET /api/health-plans/:id` - Get specific plan
- `POST /api/health-plans` - Create plan
- `POST /api/health-plans/generate` - Generate AI plan
- `PUT /api/health-plans/:id` - Update plan
- `PUT /api/health-plans/:id/tasks/:taskId` - Toggle task
- `DELETE /api/health-plans/:id` - Delete plan
- `GET /api/health-plans/analytics` - Get analytics

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellness-bot/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
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

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Database Schema

### User Model
- Personal information (name, email, age, gender)
- Health data (height, weight, blood type, allergies)
- Medical history (medications, chronic conditions)
- Emergency contacts
- App preferences
- Authentication data

### Chat Session Model
- User association
- Message history with metadata
- Session type and status
- AI-generated summaries

### Medicine Model
- Medication details (name, dosage, frequency)
- Reminder settings
- Completion tracking
- AI suggestions

### Period Cycle Model
- Cycle tracking data
- Symptom and mood tracking
- Predictions and analytics

### Health Plan Model
- AI-generated action plans
- Task management
- Progress tracking
- Completion analytics

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin policies
- **Helmet Security**: Security headers and protection
- **Environment Variables**: Sensitive data protection

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests

### Code Structure
```
src/
├── config/          # Database and app configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## API Documentation

The API follows RESTful conventions and returns JSON responses. All responses include a `success` boolean and appropriate data or error messages.

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
