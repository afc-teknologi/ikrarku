@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ==================================================
echo ikrarku - npm Repair Utility
echo ==================================================
echo.

echo [1/5] Closing stale Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/5] Removing local installation files...
if exist node_modules rmdir /s /q node_modules
if exist .npm-cache rmdir /s /q .npm-cache
mkdir .npm-cache

echo [3/5] Resetting npm registry and proxy values...
call npm config set registry https://registry.npmjs.org/
call npm config delete proxy >nul 2>&1
call npm config delete https-proxy >nul 2>&1

echo [4/5] Verifying registry...
call npm config get registry

echo [5/5] Installing with an isolated cache...
set "NPM_CONFIG_REGISTRY=https://registry.npmjs.org/"
call npm ci --cache "%CD%\.npm-cache" --prefer-online --no-audit --no-fund
if errorlevel 1 (
  echo npm ci failed. Trying npm install compatibility mode...
  if exist node_modules rmdir /s /q node_modules
  call npm install --cache "%CD%\.npm-cache" --prefer-online --no-audit --no-fund --legacy-peer-deps
)
if errorlevel 1 goto :failed

echo.
echo Repair and installation completed successfully.
echo Run START_WINDOWS.cmd to start the application.
pause
exit /b 0

:failed
echo.
echo npm still failed. Please capture the complete log path shown above.
echo Also run: node -v ^& npm -v ^& npm config get registry
pause
exit /b 1
