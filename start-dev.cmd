@echo off
REM ============================================================
REM  NNK Portfolio - persistent dev server launcher
REM  Double-click this file to (re)start the site on
REM  http://localhost:3002 in its own window. Keep that
REM  window open while you work; close it to stop the server.
REM ============================================================
cd /d "%~dp0"
title NNK Portfolio - dev server (localhost:3002)
echo Starting NNK Portfolio dev server on http://localhost:3002 ...
echo Keep this window open while working. Close it to stop the server.
echo.
call npm run dev
echo.
echo Dev server stopped. Press any key to close this window.
pause >nul
