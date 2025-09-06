#!/bin/bash

# Wellness Bot Deployment Script
# This script helps prepare your application for deployment

echo "🚀 Wellness Bot Deployment Preparation Script"
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT.md" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "1. Checking project structure..."

# Check backend structure
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    print_status "Backend directory found"
else
    print_error "Backend directory or package.json not found"
    exit 1
fi

# Check frontend structure
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    print_status "Frontend directory found"
else
    print_error "Frontend directory or package.json not found"
    exit 1
fi

echo ""
echo "2. Checking deployment configuration files..."

# Check for deployment configs
if [ -f "backend/render.yaml" ]; then
    print_status "Render configuration found"
else
    print_warning "Render configuration not found"
fi

if [ -f "frontend/vercel.json" ]; then
    print_status "Vercel configuration found"
else
    print_warning "Vercel configuration not found"
fi

echo ""
echo "3. Checking environment files..."

# Check environment files
if [ -f "backend/.env.production" ]; then
    print_status "Backend production environment template found"
else
    print_warning "Backend production environment template not found"
fi

if [ -f "frontend/.env.production" ]; then
    print_status "Frontend production environment template found"
else
    print_warning "Frontend production environment template not found"
fi

echo ""
echo "4. Testing builds..."

# Test backend build
echo "Building backend..."
cd backend
if npm run build > /dev/null 2>&1; then
    print_status "Backend builds successfully"
else
    print_error "Backend build failed - check for TypeScript errors"
fi
cd ..

# Test frontend build
echo "Building frontend..."
cd frontend
if npm run build > /dev/null 2>&1; then
    print_status "Frontend builds successfully"
else
    print_error "Frontend build failed - check for build errors"
fi
cd ..

echo ""
echo "📋 Pre-deployment Checklist:"
echo "=============================="

echo ""
echo "Backend (Render):"
echo "□ Create Render account at https://render.com"
echo "□ Set up MongoDB Atlas cluster"
echo "□ Generate strong JWT secrets"
echo "□ Configure email settings (Gmail app password)"
echo "□ Set up Cloudinary account"
echo "□ Get Gemini API key"
echo "□ Push code to Git repository"

echo ""
echo "Frontend (Vercel):"
echo "□ Create Vercel account at https://vercel.com"
echo "□ Note your backend URL after Render deployment"
echo "□ Configure environment variables in Vercel"

echo ""
echo "🎯 Next Steps:"
echo "==============="
echo "1. Read DEPLOYMENT.md for detailed instructions"
echo "2. Deploy backend to Render first"
echo "3. Deploy frontend to Vercel with backend URL"
echo "4. Update CORS settings in backend with frontend URL"
echo "5. Test the complete application"

echo ""
print_status "Deployment preparation complete!"
echo "Good luck with your deployment! 🚀"
