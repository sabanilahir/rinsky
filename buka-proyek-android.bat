@echo off
title Buka Proyek Android Studio - Rinsky Order App
echo ========================================================
echo   MEMBUKA PROYEK ANDROID STUDIO UNTUK MEMBUAT APK
echo ========================================================
echo.
echo Pastikan Android Studio sudah terpasang di laptop.
echo Script ini akan membuka folder android di Android Studio.
echo.
echo Cara Build APK di Android Studio:
echo 1. Tunggu gradle sync selesai di Android Studio
echo 2. Klik menu 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'
echo 3. File APK akan muncul di folder:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
cd /d "%~dp0"
npx cap open android
pause
