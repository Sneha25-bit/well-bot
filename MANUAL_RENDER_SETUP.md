# Manual Render Deployment (No YAML)

**IGNORE render.yaml** - We'll configure everything manually in the dashboard.

## Step 1: Delete Current Service
1. In Render dashboard, delete the failed service
2. Start fresh with manual configuration

## Step 2: Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. **DON'T use render.yaml** - configure manually

## Step 3: Basic Settings
```
Name: wellness-bot-backend
Environment: Node
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
```

## Step 4: Build & Start Commands
Try these in order until one works:

### Option 1 (Try First):
```
Build Command: npm install && npm run build
Start Command: npm start
```

### Option 2 (If Option 1 fails):
```
Build Command: npm install
Start Command: npx ts-node src/server.ts
```

### Option 3 (If Option 2 fails):
```
Build Command: npm ci
Start Command: npm start
```

### Option 4 (Minimal - for testing):
```
Build Command: npm install --production=false
Start Command: npm run dev
```

## Step 5: Environment Variables (Start Minimal)
Add only these for now:
```
NODE_ENV=development
PORT=10000
```

## Step 6: Deploy and Check Logs
1. Click "Create Web Service"
2. Go to "Logs" tab immediately
3. Watch for specific error messages
4. If it fails, copy the EXACT error message

## Step 7: If Build Succeeds
Test the endpoints:
- Root: https://your-app.onrender.com/
- Health: https://your-app.onrender.com/api/health

## Step 8: Add More Environment Variables
Once basic deployment works, add:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

## Common Error Messages & Solutions

### "Cannot resolve module"
- Build command: `npm install --production=false`
- This installs devDependencies too

### "Permission denied"
- Try different regions (Oregon, Virginia)
- Retry deployment

### "TypeScript compiler not found"
- Build command: `npm install typescript && npm run build`

### "Out of memory"
- Use build command: `npm ci --production=false && npm run build`

### "Port in use"
- Check PORT=10000 in environment variables
- Try PORT=3000 instead

## If Nothing Works
Try deploying without TypeScript:
```
Build Command: npm install
Start Command: node --loader ts-node/esm src/server.ts
```

Or use development mode:
```
Build Command: npm install
Start Command: npm run dev
```
