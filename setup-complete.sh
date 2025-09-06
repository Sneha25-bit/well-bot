#!/bin/bash

echo "🎉 Wellness Bot - Complete Setup Verification"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check backend
echo ""
echo "🔧 Backend Setup:"
cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your MongoDB URI and other settings"
else
    echo "✅ Backend .env file exists"
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies installed"
fi

# Test build
echo "🔨 Testing backend build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Backend builds successfully"
else
    echo "❌ Backend build failed"
    exit 1
fi

cd ..

# Check frontend
echo ""
echo "🎨 Frontend Setup:"
cd frontend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cp env.example .env
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file exists"
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies installed"
fi

# Test build
echo "🔨 Testing frontend build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup Complete! All systems are ready."
echo ""
echo "📋 Next Steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT secrets"
echo "2. Start MongoDB (if not already running)"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo "5. Visit http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - README.md"
echo "   - INTEGRATION_GUIDE.md"
echo ""
echo "🚀 Your Wellness Bot is ready to go!"

