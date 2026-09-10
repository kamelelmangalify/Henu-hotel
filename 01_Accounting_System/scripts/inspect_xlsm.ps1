# inspect_xlsm.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

Write-Host "=========================================="
Write-Host "📊 الملف السنوي: $filePath"
Write-Host "عدد الشيتات الكلي: $($wb.Sheets.Count)"
Write-Host "=========================================="

foreach ($sheet in $wb.Sheets) {
    Write-Host "📋 Sheet: '$($sheet.Name)' | عدد الأزرار: $($sheet.Buttons().Count) | الصفوف المستخدمة: $($sheet.UsedRange.Rows.Count)"
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
