@echo off
rem Opens the Sintrol booth showcase full screen (kiosk mode).
rem Exit kiosk mode with Alt+F4.

set "PAGE=%~dp0index.html"
set "PROFILE=%TEMP%\sintrol-booth-profile"
set "FLAGS=--kiosk --no-first-run --disable-session-crashed-bubble --disable-features=Translate --autoplay-policy=no-user-gesture-required --user-data-dir="%PROFILE%""

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
  start "" "%CHROME%" %FLAGS% "%PAGE%"
  goto :eof
)

set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" %FLAGS% --edge-kiosk-type=fullscreen "%PAGE%"
  goto :eof
)

echo Could not find Chrome or Edge. Open index.html in any modern browser and press F for full screen.
pause
