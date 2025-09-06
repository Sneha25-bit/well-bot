# Deployment Guide

This guide covers deploying the Wellness Bot application with the backend on Render and the frontend on Vercel.

## Backend Deployment (Render)

### Prerequisites
1. **MongoDB Atlas Account**: Set up a MongoDB Atlas cluster for production database
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Environment Variables**: Prepare production values for all environment variables

### Step 1: Prepare Your Repository
1. Ensure your code is pushed to GitHub/GitLab/Bitbucket
2. The `render.yaml` file is already configured in the `backend/` directory

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure the service:
   - **Name**: `wellness-bot-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables
In Render's Environment Variables section, add these variables with your production values:

```bash
# Required - Update these with your actual values
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellness-bot
JWT_SECRET=your-super-secret-jwt-key-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@wellnessbot.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
GEMINI_API_KEY=your-gemini-api-key

# Will be updated after frontend deployment
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app

# These are pre-configured but can be modified
NODE_ENV=production
PORT=10000
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your backend
3. Note your backend URL (e.g., `https://wellness-bot-backend.onrender.com`)

## Frontend Deployment (Vercel)

### Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Backend URL**: Your Render backend URL from the previous step

### Step 1: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables
In Vercel's Environment Variables section, add:

```bash
# Update with your actual Render backend URL
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=Wellness Bot
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

### Step 3: Deploy
1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Note your frontend URL (e.g., `https://your-project.vercel.app`)

### Step 4: Update Backend CORS Settings
1. Go back to your Render dashboard
2. Update these environment variables in your backend service:
   ```bash
   FRONTEND_URL=https://your-project.vercel.app
   CORS_ORIGIN=https://your-project.vercel.app
   ```
3. Your backend will automatically redeploy with the new settings

## Production Checklist

### Security
- [ ] Generate strong, unique JWT secrets
- [ ] Use production MongoDB Atlas cluster
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set up proper CORS origins
- [ ] Use strong app passwords for email
- [ ] Secure Cloudinary and Gemini API keys

### Environment Variables
- [ ] All backend environment variables set in Render
- [ ] All frontend environment variables set in Vercel
- [ ] URLs correctly configured between frontend and backend
- [ ] Database connection string updated for production

### Testing
- [ ] Backend health check endpoint responds: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads correctly: `https://your-frontend.vercel.app`
- [ ] API calls work between frontend and backend
- [ ] Authentication flow works
- [ ] File uploads work (if implemented)
- [ ] Email notifications work (if implemented)

## Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check Render logs for errors
   - Verify all required environment variables are set
   - Ensure MongoDB connection string is correct

2. **Frontend can't connect to backend**
   - Verify `VITE_API_URL` in Vercel environment variables
   - Check CORS settings in backend
   - Ensure backend is running and accessible

3. **Database connection errors**
   - Check MongoDB Atlas connection string
   - Verify IP whitelist includes Render's IPs (or use 0.0.0.0/0 for testing)
   - Check username/password in connection string

4. **Build failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check TypeScript compilation errors

### Useful Commands

```bash
# Test backend locally with production build
cd backend
npm run build
npm start

# Test frontend locally with production build
cd frontend
npm run build
npm run preview
```

## Custom Domains (Optional)

### Backend (Render)
1. In Render dashboard, go to your service
2. Go to "Settings" → "Custom Domains"
3. Add your domain and configure DNS

### Frontend (Vercel)
1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Add your domain and configure DNS

## Monitoring and Maintenance

- Monitor application logs in both Render and Vercel dashboards
- Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- Regular security updates for dependencies
- Database backup strategy for MongoDB Atlas
- Consider setting up CI/CD pipelines for automated deployments
