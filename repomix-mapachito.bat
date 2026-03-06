@echo off
chcp 65001 >nul

call npx repomix
if %errorlevel% neq 0 exit /b %errorlevel%

(
echo ================================================================================
echo COMPLETE REPOSITORY FILE LIST
echo ================================================================================
git ls-files -co --exclude-standard
echo ================================================================================
echo REPOMIX OUTPUT BEGINS BELOW:
echo ================================================================================
echo.
type repomix-output.xml
) > repomix-temp.xml

move /y repomix-temp.xml repomix-output.xml >nul

antigravity .\repomix-output.xml