@echo off
title Interview Helper AI
echo ============================================================
echo   Starting Interview Helper AI (Live Desktop Assistant)
echo ============================================================
echo.
echo Hotkeys:
echo   - Ctrl + Shift + H: Toggle Stealth Hide/Show Overlay
echo   - Ctrl + Shift + M: Toggle Mute Audio
echo   - Ctrl + Shift + Space: Trigger Instant Answer
echo.
call npm run electron:dev
pause
