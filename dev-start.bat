@echo off
echo Starting JobPortal Development Servers...
echo.

echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:5173
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Both servers are starting...
echo Close this window to stop both servers.
pause