@echo off
echo Building JobPortal for Production...
echo.

echo [1/2] Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo [2/2] Starting production server...
cd ..\backend
set NODE_ENV=production
call npm start

pause