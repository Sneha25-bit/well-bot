# Render Deployment Troubleshooting

## 🔧 Common Build Issues and Solutions

### 1. **Build Command Issues**

**Problem:** Build fails with dependency errors
**Solution:** Updated render.yaml to use `npm ci` instead of `npm install`

```yaml
buildCommand: npm ci && npm run build
```

### 2. **Node.js Version Issues**

**Problem:** Build fails due to Node.js version mismatch
**Solutions:**
- Added `.nvmrc` file with Node.js version 20
- Added engines specification in package.json
- Render will use Node.js 20.x

### 3. **Missing Environment Variables**

**Problem:** Build fails due to missing required environment variables
**Solution:** Ensure these are set in Render dashboard:

**CRITICAL - These must be set before deployment:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

### 4. **TypeScript Compilation Issues**

**Problem:** TypeScript build fails
**Solutions:**
```bash
# Test build locally first:
npm run build

# If it fails locally, check:
- tsconfig.json configuration
- Missing type definitions
- Import/export issues
```

### 5. **Memory Issues**

**Problem:** Build fails due to memory limits
**Solution:** Free tier has memory limits. If build fails:
- Remove unnecessary dev dependencies from production
- Use `npm ci` instead of `npm install`
- Consider upgrading to paid tier if needed

## 🚀 Step-by-Step Deployment Process

### 1. **Pre-deployment Checklist**
- [ ] Code is pushed to your Git repository
- [ ] Build works locally: `npm run build`
- [ ] Health check endpoint exists: `/api/health`
- [ ] Environment variables are ready

### 2. **Render Dashboard Setup**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name:** `wellness-bot-backend`
   - **Environment:** `Node`
   - **Region:** `Oregon` (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`

### 3. **Environment Variables Setup**
Add all environment variables from the main deployment guide.

**Critical Variables (must be set):**
- MONGODB_URI
- JWT_SECRET
- JWT_REFRESH_SECRET
- All email configuration variables
- Cloudinary variables
- Gemini API key

### 4. **Deploy**
Click "Create Web Service" and monitor the build logs.

## 🐛 Debugging Build Failures

### **View Build Logs**
1. In Render dashboard, go to your service
2. Click "Logs" tab
3. Look for specific error messages

### **Common Error Messages and Solutions**

#### "npm ERR! code ENOTFOUND"
- **Issue:** Network/DNS issues during build
- **Solution:** Retry deployment, usually resolves itself

#### "Module not found"
- **Issue:** Missing dependencies
- **Solution:** Check package.json, ensure all dependencies are listed

#### "TypeScript compilation failed"
- **Issue:** TS errors in code
- **Solution:** Run `npm run build` locally to see specific errors

#### "Environment variable not defined"
- **Issue:** Missing required env vars
- **Solution:** Add missing variables in Render dashboard

#### "Port already in use"
- **Issue:** Port configuration
- **Solution:** Ensure PORT=10000 in environment variables

### **Memory/Timeout Issues**
- Build takes too long or runs out of memory
- Solution: 
  - Clean `node_modules`: Add build command `rm -rf node_modules && npm ci && npm run build`
  - Use production dependencies only

## 🧪 Testing After Deployment

### **1. Health Check**
Visit: `https://your-app.onrender.com/api/health`

Expected response:
```json
{
  "success": true,
  "message": "Wellness Bot API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### **2. Root Endpoint**
Visit: `https://your-app.onrender.com/`

Should show API documentation and available endpoints.

### **3. Database Connection**
Check logs for successful MongoDB connection message.

## 🔄 If Build Still Fails

### **1. Simplify Build Process**
Temporarily update render.yaml:
```yaml
buildCommand: npm install
startCommand: node src/server.js
```

### **2. Check Dependencies**
Remove any optional dependencies that might cause issues:
```bash
npm prune --production
```

### **3. Local Testing**
Test the exact build process locally:
```bash
rm -rf node_modules
rm -rf dist
npm ci
npm run build
npm start
```

### **4. Contact Support**
If all else fails:
- Check Render status page
- Contact Render support with specific error messages
- Try deploying to different region

## 🎯 Success Indicators

✅ **Build succeeds** - No errors in build logs
✅ **Service starts** - "Server running" message in logs
✅ **Health check works** - `/api/health` returns 200
✅ **Database connects** - No connection errors in logs
✅ **Environment variables loaded** - No "undefined" errors

Your backend should now be accessible at:
`https://your-app-name.onrender.com`
