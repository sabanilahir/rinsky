@echo off
title Rinsky Order App - Server
echo ========================================================
echo   MENJALANKAN APLIKASI RINSKY ORDER APP (@rinsky_id)
echo ========================================================
echo.
echo 1. Di Laptop: Buka browser ke http://localhost:5173
echo 2. Di HP Android: Sambungkan ke WiFi yang sama, lalu buka
echo    alamat IP laptop (misal: http://192.168.1.7:5173) di Chrome
echo 3. Di Chrome HP, tekan Titik Tiga (Menu) -> "Install App"
echo.
echo ========================================================
cd /d "%~dp0"
npx vite preview --host 0.0.0.0 --port 5173
pause
