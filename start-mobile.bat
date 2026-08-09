@echo off
title JobEzz Expo Launcher
echo ========================================================
echo   JobEzz Expo Mobile Launcher
echo ========================================================
echo.
echo   [1] Open Mobile App in Web Browser
echo   [2] Expo Metro Server (LAN QR Code)
echo   [3] Expo Metro Server with Tunnel (for 4G / strict Wi-Fi)
echo   [4] Clear Cache and Restart Metro
echo.
cd /d "%~dp0android-app"

for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "$ip=(Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue | Sort-Object RouteMetric | Select-Object -First 1); (Get-NetIPAddress -InterfaceIndex $ip.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue).IPAddress"`) do set LANIP=%%a

if defined LANIP (
  echo Detected LAN IP: %LANIP%
  set REACT_NATIVE_PACKAGER_HOSTNAME=%LANIP%
)

powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host 'Freed port 8081' }"

set /p opt="Choose option [1-4] (default 1): "

if "%opt%"=="2" (
  npm start
) else if "%opt%"=="3" (
  npm run start:tunnel
) else if "%opt%"=="4" (
  npm run start:clear
) else (
  npm run web
)

pause
