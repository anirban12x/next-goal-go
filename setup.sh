#!/bin/bash

echo "🎯 Daily Goals App Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ npm $(npm --version) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# MongoDB Connection String - Replace with your actual MongoDB URI
MONGODB_URI=mongodb://localhost:27017/goal-tracker

# JWT Secret Key - Replace with a strong random string for production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Created .env.local file"
    echo "⚠️  Please update the MongoDB URI and JWT secret in .env.local"
else
    echo "✅ .env.local already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Setup Complete!"
    echo "=================================="
    echo "To start the development server:"
    echo "  npm run dev"
    echo ""
    echo "To start the production server:"
    echo "  npm start"
    echo ""
    echo "The app will be available at: http://localhost:3000"
    echo ""
    echo "📋 Don't forget to:"
    echo "  1. Set up MongoDB (local or Atlas)"
    echo "  2. Update MONGODB_URI in .env.local"
    echo "  3. Change JWT_SECRET to a secure value"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
