# inspect_annual_august_sheet.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

if (-not (Test-Path $filePath)) {
    Write-Host "❌ File not found: $filePath"
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

$sheet = $null
foreach ($s in $wb.Sheets) {
    if ($s.Name -match "08-أغسطس|أغسطس|August") {
        $sheet = $s
        break
    }
}

if ($sheet) {
    Write-Host "Found Sheet: '$($sheet.Name)' | Used Rows: $($sheet.UsedRange.Rows.Count)"
    $usedRows = $sheet.UsedRange.Rows.Count
    
    $rowsData = @()
    for ($r = 1; $r -le $usedRows; $r++) {
        $num    = $sheet.Cells.Item($r, 1).Text
        $date   = $sheet.Cells.Item($r, 2).Text
        $openB  = $sheet.Cells.Item($r, 3).Text
        $permit = $sheet.Cells.Item($r, 4).Text
        $desc   = $sheet.Cells.Item($r, 5).Text
        $recv   = $sheet.Cells.Item($r, 6).Text
        $expStr = $sheet.Cells.Item($r, 7).Text
        $revStr = $sheet.Cells.Item($r, 8).Text
        $inv    = $sheet.Cells.Item($r, 9).Text
        $balStr = $sheet.Cells.Item($r, 10).Text
        $alert  = $sheet.Cells.Item($r, 11).Text
        $notes  = $sheet.Cells.Item($r, 12).Text

        $expVal = 0; if ($expStr -match "[\d\.]+") { $expVal = [double]($expStr -replace "[^\d\.]", "") }
        $revVal = 0; if ($revStr -match "[\d\.]+") { $revVal = [double]($revStr -replace "[^\d\.]", "") }
        $balVal = 0; if ($balStr -match "[\d\.]+") { $balVal = [double]($balStr -replace "[^\d\.]", "") }

        if ($num -or $date -or $desc -or $expVal -gt 0 -or $revVal -gt 0) {
            $rowsData += [PSCustomObject]@{
                Row         = $r
                Num         = $num
                Date        = $date
                Description = $desc
                Expense     = $expVal
                Revenue     = $revVal
                Balance     = $balVal
                Notes       = $notes
            }
            Write-Host "Row ${r}: [$date] | $desc | Exp: $expVal | Rev: $revVal | Bal: $balVal"
        }
    }
    
    Write-Host "=========================================="
    Write-Host "Total Extracted Rows: $($rowsData.Count)"
} else {
    Write-Host "❌ Sheet 08-أغسطس not found!"
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
