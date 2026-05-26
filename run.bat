@echo off
title ResumeAI Launcher
echo ===================================================
echo               RESUMEAI SYSTEM LAUNCHER
echo ===================================================
echo.
echo Launching your dual-tier web application...
echo.

:: Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required to run the Express backend and package systems.
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit
)

echo [1/3] Setting up Backend Dependencies (Express, CORS, Dotenv)...
cd backend
call npm install
cd ..
echo Setup complete.
echo.

echo [2/3] Launching Express API Server (Port 5000) in background terminal...
start "ResumeAI Express Server" cmd /c "cd backend && npm start"
echo Express server initiated.
echo.

echo [3/3] Launching Frontend Web Server (Port 3000) and opening browser...
start "" http://localhost:3000
echo.
echo ===================================================
echo System ready! Leave this terminal open to keep servers running.
echo To stop the servers, simply close the generated terminal windows.
echo ===================================================
echo.

npx -y serve -l 3000 frontend

pause
