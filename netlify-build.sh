#!/bin/bash
set -e

echo "🚀 Starting Netlify build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Run build
echo "🔨 Building application..."
npm run build

# Check if dist directory exists
if [ -d "dist" ]; then
    echo "✅ Build directory 'dist' exists"
    ls -la dist/
else
    echo "❌ Build directory 'dist' does not exist"
    exit 1
fi

# Check if index.html exists
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found in dist directory"
else
    echo "❌ index.html not found in dist directory"
    exit 1
fi

echo "🎉 Build completed successfully!"