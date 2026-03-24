@echo off
echo Installing JobPortal dependencies...
echo.

echo [1/3] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b 1
)

echo [2/3] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b 1
)

echo [3/3] Setup complete!
echo.
echo To start the project:
echo 1. Update backend\.env with your credentials
echo 2. Run: npm run dev:all
echo.
pause