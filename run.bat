@echo off
echo Stopping any existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting crochet app...
echo.
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"

start "" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul

echo.
echo Opening browser...
start http://127.0.0.1:3000

echo.
echo Try these URLs if one doesn't work:
echo   http://127.0.0.1:3000
echo   http://localhost:3000
echo Or check the terminal for the actual port (may be 3001 or 3002)
pause
