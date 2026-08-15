@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ==================================================
echo ikrarku Sites CMS - Install ^& Start (Fixed)
echo ==================================================
echo.

echo [1/3] Cek Node.js...
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js tidak ditemukan.
  echo Install Node.js 22 LTS dulu dari https://nodejs.org lalu jalankan lagi file ini.
  echo.
  pause
  exit /b 1
)
call node -v
call npm -v
echo.

echo [2/3] Memasang dependencies (bisa beberapa menit, butuh internet)...
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo Percobaan pertama gagal. Mencoba mode kompatibilitas...
  call npm install --no-audit --no-fund --legacy-peer-deps
  if errorlevel 1 (
    echo.
    echo Instalasi masih gagal. Salin/screenshot pesan error di atas.
    echo.
    pause
    exit /b 1
  )
)
echo.

echo [3/3] Menjalankan aplikasi...
echo Web CMS : http://localhost:5173
echo API     : http://localhost:5180
echo Login   : admin / admin
echo.
echo Biarkan jendela ini TETAP TERBUKA. Tekan Ctrl+C untuk berhenti.
echo.
call npm run dev

echo.
echo (Server berhenti. Tekan tombol apa saja untuk menutup jendela ini.)
pause
