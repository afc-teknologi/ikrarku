@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ==================================================
echo Starting ikrarku Sites CMS v0.15
echo ==================================================
echo.

if not exist node_modules (
  echo Dependencies are not installed.
  echo Run INSTALL_WINDOWS.cmd first.
  pause
  exit /b 1
)

echo Web CMS : http://localhost:5173
echo API     : http://localhost:5180
echo Default Admin: admin / admin
echo.
echo Keep this window open. Press Ctrl+C to stop the servers.
echo.
call npm run dev
