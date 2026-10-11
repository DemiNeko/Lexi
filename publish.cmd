@echo off
cd /d "%~dp0"
echo Lexi Academic - publish to GitHub Pages
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish.ps1"
echo.
pause
