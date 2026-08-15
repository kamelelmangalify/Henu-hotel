@echo off
chcp 65001 >nul
setlocal
set PWSH=D:\Henu\tools\pwsh7\pwsh.exe
set SCRIPTS=D:\Henu\accountant\scripts
set CMD=%1

if /i "%CMD%"=="sync" (
    "%PWSH%" -NoProfile -File "%SCRIPTS%\zoho_sync.ps1"
    goto :end
)

if /i "%CMD%"=="report" (
    if "%2"=="" (
        "%PWSH%" -NoProfile -File "%SCRIPTS%\generate_daily_report.ps1"
    ) else (
        "%PWSH%" -NoProfile -File "%SCRIPTS%\generate_daily_report.ps1" -Date "%2"
    )
    goto :end
)

if /i "%CMD%"=="payroll" (
    echo === تقرير الرواتب والسلف ===
    "%PWSH%" -NoProfile -File "%SCRIPTS%\generate_payroll_report.ps1"
    goto :end
)

echo Usage: run sync ^| report [date] ^| payroll
