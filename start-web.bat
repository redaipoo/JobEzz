@echo off
title JobEzz Web Server
echo ========================================================
echo   JobEzz Web Prototype & Admin Launcher (Port 3000)
echo ========================================================
echo.
echo Starting Web Server...
echo Web App URL:   http://localhost:3000/index-legendary.html
echo Admin URL:     http://localhost:3000/admin-legendary.html
echo Showcase URL:  http://localhost:3000/showcase.html
echo.
echo Opening browser in 2 seconds...
timeout /t 2 /nobreak >nul
start http://localhost:3000/index-legendary.html
npx -y serve web-prototype -p 3000
pause
