#!/bin/bash

echo "🚀 Starting Wellness Bot - MERN Stack Application"
echo "=================================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   Or start manually: mongod"
    echo ""
    read -p "Press Enter to continue anyway (backend will fail if MongoDB is not running)..."
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Setting up backend environment..."
    cp backend/env.example backend/.env
    echo "✅ Backend .env created. Please edit backend/.env with your MongoDB URI and other settings."
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Setting up frontend environment..."
    cp frontend/env.example frontend/.env
    echo "✅ Frontend .env created. API URL defaults to localhost:5000."
fi

echo ""
echo "🔧 Installing dependencies..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend:  cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "📚 See INTEGRATION_GUIDE.md for detailed setup instructions."
