#!/bin/bash

# MMA Tracker - Quick Start Script
# This script runs both the TypeScript backend and React frontend

echo "🥊 Starting MMA Tracker..."
echo "======================================"

# Check if backend dependencies are installed
if [ ! -d "backend-ts/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend-ts && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Start both servers in the background
echo ""
echo "🚀 Starting TypeScript backend on port 5000..."
cd backend-ts
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "🚀 Starting React frontend on port 5173..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "======================================"
echo "✅ Both servers are starting!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:5000"
echo "📍 Metrics:  http://localhost:5000/api/metrics"
echo ""
echo "📝 Logs:"
echo "   Backend: tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop both servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or press Ctrl+C twice"
echo "======================================"

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Keep script running
wait
