# Alternative Build Commands for Render

If the standard build fails, try these commands in order:

## 1. Basic Build (try first)
```
Build Command: npm install && npm run build
Start Command: npm start
```

## 2. Clean Install
```
Build Command: rm -rf node_modules && npm ci && npm run build
Start Command: npm start
```

## 3. Skip TypeScript Build (for testing)
```
Build Command: npm install
Start Command: npx ts-node src/server.ts
```

## 4. Yarn Alternative
```
Build Command: yarn install && yarn build
Start Command: yarn start
```

## 5. Manual TypeScript Compilation
```
Build Command: npm install && npx tsc
Start Command: node dist/server.js
```

## 6. Development Mode (last resort)
```
Build Command: npm install
Start Command: npm run dev
```

## Environment Variables for Testing
Start with minimal variables:
```
NODE_ENV=development
PORT=10000
```

Add others one by one after basic deployment works.

## Common Error Solutions

### "Cannot find module"
- Check all imports in your TypeScript files
- Ensure all dependencies are in package.json

### "TypeScript compilation failed"
- Run `npm run build` locally to see exact errors
- Check tsconfig.json configuration

### "npm ERR! network"
- Retry deployment (network issues)
- Try different build commands

### "Memory exceeded"
- Use `npm ci` instead of `npm install`
- Remove unnecessary dependencies
