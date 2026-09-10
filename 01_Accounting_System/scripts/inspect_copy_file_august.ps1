# inspect_copy_file_august.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\Copy of سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

if (-not (Test-Path $filePath)) {
    Write-Host "❌ File not found at path: $filePath"
    # Search for files with similar names
    $similar = Get-ChildItem "D:\Henu" -Filter "*سجل*"
    Write-Host "Existing files in D:\Henu:"
    foreach ($f in $similar) { Write-Host " - $($f.Name)" }
    exit
}

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

Write-Host "=========================================="
Write-Host "📊 Inspecting File: $filePath"
Write-Host "Total Sheets: $($wb.Sheets.Count)"
Write-Host "=========================================="

foreach ($s in $wb.Sheets) {
    Write-Host "📋 Sheet: '$($s.Name)' | Rows: $($s.UsedRange.Rows.Count)"
}

$augSheet = $null
foreach ($s in $wb.Sheets) {
    if ($s.Name -match "أغسطس|08-أغسطس|August") {
        $augSheet = $s
        break
    }
}

if ($augSheet) {
    Write-Host ""
    Write-Host "=== Data in Sheet '$($augSheet.Name)' ==="
    $usedRows = $augSheet.UsedRange.Rows.Count
    for ($r = 1; $r -le $usedRows; $r++) {
        $col1 = $augSheet.Cells.Item($r, 1).Text
        $col2 = $augSheet.Cells.Item($r, 2).Text
        $col5 = $augSheet.Cells.Item($r, 5).Text
        $col7 = $augSheet.Cells.Item($r, 7).Text
        $col8 = $augSheet.Cells.Item($r, 8).Text
        $col10 = $augSheet.Cells.Item($r, 10).Text
        if ($col1 -or $col5 -or $col7 -or $col8) {
            Write-Host "Row ${r}: [$col1] | [$col2] | [$col5] | Exp: $col7 | Rev: $col8 | Bal: $col10"
        }
    }
} else {
    Write-Host "⚠️ Sheet for August not found!"
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
