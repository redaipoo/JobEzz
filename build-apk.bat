@echo off
title JobEzz - Build Android APK
echo ========================================================
echo   JobEzz - Expo EAS Direct APK Builder
echo ========================================================
echo.
echo 1. Checking EAS CLI installation...
cd android-app
call npx eas-cli --version >nul 2>&1
if %errorlevel% neq 0 (
  echo Installing eas-cli...
  call npm install -g eas-cli
)

echo.
echo 2. Logging into Expo account...
call npx eas-cli login

echo.
echo 3. Starting APK cloud build...
call npx eas-cli build -p android --profile preview

echo.
echo Build process initiated. Check your Expo dashboard or terminal for download link.
pause
