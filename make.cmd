@echo off
rem Windows entrypoint; no GNU make or PowerShell required.
rem quality is the normal test entrypoint; coverage is a separate run.
setlocal
set "NODE_V8_COVERAGE="
node "%~dp0scripts\make.js" %*
exit /b %ERRORLEVEL%
