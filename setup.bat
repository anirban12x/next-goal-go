@echo off
echo 🎯 Daily Goals App Setup Script
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    (
    echo # MongoDB Connection String - Replace with your actual MongoDB URI
    echo MONGODB_URI=mongodb://localhost:27017/goal-tracker
    echo.
    echo # JWT Secret Key - Replace with a strong random string for production
    echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    echo.
    echo # Next.js Environment
    echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > .env.local
    echo ✅ Created .env.local file
    echo ⚠️  Please update the MongoDB URI and JWT secret in .env.local
) else (
    echo ✅ .env.local already exists
)

REM Build the project
echo 🔨 Building the project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🚀 Setup Complete!
    echo ==================================
    echo To start the development server:
    echo   npm run dev
    echo.
    echo To start the production server:
    echo   npm start
    echo.
    echo The app will be available at: http://localhost:3000
    echo.
    echo 📋 Don't forget to:
    echo   1. Set up MongoDB ^(local or Atlas^)
    echo   2. Update MONGODB_URI in .env.local
    echo   3. Change JWT_SECRET to a secure value
) else (
    echo ❌ Build failed. Please check the errors above.
)

pause
