
# inspect_excel.ps1
param([string]$ExcelPath = "D:\Henu\hostel_temp.xlsx")
$xl  = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false
$wb  = $xl.Workbooks.Open($ExcelPath)
Write-Host "=== Sheets ==="
$sheetCount = $wb.Sheets.Count
for ($i = 1; $i -le $sheetCount; $i++) {
    Write-Host "  [$i] $($wb.Sheets.Item($i).Name)"
}
$sheetNums = 1..$sheetCount
foreach ($sheetIdx in $sheetNums) {
    $ws = $wb.Sheets.Item($sheetIdx)
    Write-Host ""
    Write-Host "=== Sheet: $($ws.Name) ==="
    $lastCol = $ws.UsedRange.Columns.Count
    $lastRow = $ws.UsedRange.Rows.Count
    if ($lastCol -gt 12) { $lastCol = 12 }
    if ($lastRow -gt 30) { $lastRow = 30 }
    for ($r = 1; $r -le $lastRow; $r++) {
        $parts = @()
        for ($c = 1; $c -le $lastCol; $c++) {
            $val = $ws.Cells.Item($r, $c).Text
            if ($val -ne "") {
                $parts += "C" + $c + "=[" + $val + "]"
            }
        }
        if ($parts.Count -gt 0) {
            $line = "  Row" + $r + ": " + ($parts -join " | ")
            Write-Host $line
        }
    }
}
$wb.Close($false)
$xl.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($xl) | Out-Null
Write-Host "=== Done ==="
