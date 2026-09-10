# read_august_copy_data.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\Copy of سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)
$s = $wb.Sheets.Item("اغسطس")

$usedRows = $s.UsedRange.Rows.Count
Write-Host "=========================================="
Write-Host "📊 Reading Sheet 'اغسطس' from Copy File"
Write-Host "Total Used Rows: $usedRows"
Write-Host "=========================================="

$rowsData = @()

for ($r = 1; $r -le $usedRows; $r++) {
    $num    = $s.Cells.Item($r, 1).Text
    $date   = $s.Cells.Item($r, 2).Text
    $openB  = $s.Cells.Item($r, 3).Text
    $permit = $s.Cells.Item($r, 4).Text
    $desc   = $s.Cells.Item($r, 5).Text
    $recv   = $s.Cells.Item($r, 6).Text
    $expStr = $s.Cells.Item($r, 7).Text
    $revStr = $s.Cells.Item($r, 8).Text
    $inv    = $s.Cells.Item($r, 9).Text
    $balStr = $s.Cells.Item($r, 10).Text
    $alert  = $s.Cells.Item($r, 11).Text
    $notes  = $s.Cells.Item($r, 12).Text

    $expVal = 0; if ($expStr -match "[\d\.]+") { $expVal = [double]($expStr -replace "[^\d\.]", "") }
    $revVal = 0; if ($revStr -match "[\d\.]+") { $revVal = [double]($revStr -replace "[^\d\.]", "") }
    $balVal = 0; if ($balStr -match "[\d\.]+") { $balVal = [double]($balStr -replace "[^\d\.]", "") }

    if ($num -or $date -or $desc -or $expVal -gt 0 -or $revVal -gt 0) {
        $rowObj = [PSCustomObject]@{
            RowIndex    = $r
            Num         = $num
            Date        = $date
            Description = $desc
            Receiver    = $recv
            Expense     = $expVal
            Revenue     = $revVal
            Balance     = $balVal
            Notes       = $notes
            Permit      = $permit
        }
        $rowsData += $rowObj
        Write-Host "Row ${r}: [$date] | $desc | Exp: $expVal | Rev: $revVal | Bal: $balVal | Notes: $notes"
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host ""
Write-Host "=========================================="
Write-Host "Total Extracted Rows: $($rowsData.Count)"
Write-Host "Total Expenses Sum: $("{0:N0}" -f ($rowsData | Measure-Object Expense -Sum).Sum) ج.م"
Write-Host "Total Revenues Sum: $("{0:N0}" -f ($rowsData | Measure-Object Revenue -Sum).Sum) ج.م"
Write-Host "=========================================="
