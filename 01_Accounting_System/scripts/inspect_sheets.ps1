# inspect_sheets.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$filePath = "D:\Henu\سجل الايرادات والمصروفات.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

Write-Host "=========================================="
Write-Host "عدد الـ Sheets المسجلة: $($wb.Sheets.Count)"
Write-Host "=========================================="

foreach ($sheet in $wb.Sheets) {
    Write-Host "📋 Sheet: '$($sheet.Name)' | المستخدم: $($sheet.UsedRange.Rows.Count) صف"
}

Write-Host ""
$lastSheet = $wb.Sheets.Item($wb.Sheets.Count)
Write-Host "=== تفاصيل الشيت الأخير: '$($lastSheet.Name)' ==="

for ($r = 1; $r -le $lastSheet.UsedRange.Rows.Count; $r++) {
    $rowVals = @()
    for ($c = 1; $c -le 14; $c++) {
        $v = $lastSheet.Cells.Item($r, $c).Text
        $rowVals += "[$v]"
    }
    $line = $rowVals -join " "
    $clean = ($line -replace "\[\s*\]", "").Trim()
    if ($clean) {
        Write-Host "R$r : $line"
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
