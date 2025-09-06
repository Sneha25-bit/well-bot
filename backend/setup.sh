#!/bin/bash

# Wellness Bot Backend Setup Script
echo "🚀 Setting up Wellness Bot Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your configuration before running the server."
else
    echo "✅ .env file already exists"
fi

# Create dist directory for build
echo "📁 Creating build directory..."
mkdir -p dist

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your MongoDB URI and other configuration"
echo "2. Make sure MongoDB is running on your system"
echo "3. Run 'npm run dev' to start the development server"
echo "4. The API will be available at http://localhost:5000"
echo ""
echo "📚 API Documentation: http://localhost:5000"
echo "🔍 Health Check: http://localhost:5000/api/health"
echo ""
echo "Happy coding! 🎉"
