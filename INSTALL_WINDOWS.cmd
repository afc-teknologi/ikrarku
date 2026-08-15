@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NPM_CONFIG_REGISTRY=https://registry.npmjs.org/"
set "NPM_CONFIG_AUDIT=false"
set "NPM_CONFIG_FUND=false"
set "LOCAL_CACHE=%CD%\.npm-cache"

echo ==================================================
echo ikrarku Sites CMS v0.15 - Windows Installer
echo ==================================================
echo.

echo [1/6] Checking Node.js and npm...
where node >nul 2>&1 || goto :node_error
where npm >nul 2>&1 || goto :node_error
node -v
npm -v
node -e "const [major,minor]=process.versions.node.split('.').map(Number); if(major<22 || (major===22 && minor<13)){console.error('Node.js 22.13.0 or newer is required.'); process.exit(1)}"
if errorlevel 1 goto :node_error

echo.
echo [2/6] Using the public npm registry...
call npm config set registry https://registry.npmjs.org/
if errorlevel 1 goto :install_error

echo.
echo [3/6] Checking package-lock registry references...
findstr /i /c:"packages.applied-caas" package-lock.json >nul 2>&1
if not errorlevel 1 (
  echo ERROR: package-lock.json still contains an internal registry.
  goto :install_error
)
echo Registry references are clean.

echo.
echo [4/6] Preparing an isolated npm cache...
if not exist "%LOCAL_CACHE%" mkdir "%LOCAL_CACHE%"
if exist node_modules rmdir /s /q node_modules

echo.
echo [5/6] Installing dependencies...
call npm ci --cache "%LOCAL_CACHE%" --prefer-online --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo npm ci did not complete. Trying the compatibility installer...
  if exist node_modules rmdir /s /q node_modules
  call npm install --cache "%LOCAL_CACHE%" --prefer-online --no-audit --no-fund --legacy-peer-deps
  if errorlevel 1 goto :install_error
)

echo.
echo [6/6] Starting API and Web CMS...
echo Web CMS : http://localhost:5173
echo API     : http://localhost:5180
echo Default Admin: admin / admin
echo.
echo Keep this window open. Press Ctrl+C to stop the servers.
echo.
call npm run dev
exit /b 0

:node_error
echo.
echo Node.js 22.13.0 or newer and npm were not detected.
echo Install Node.js 22 LTS, close this window, then run INSTALL_WINDOWS.cmd again.
pause
exit /b 1

:install_error
echo.
echo Installation did not complete.
echo.
echo Try FIX_NPM_WINDOWS.cmd in this folder, then run INSTALL_WINDOWS.cmd again.
echo The npm version update notice is informational and is not the error.
pause
exit /b 1
