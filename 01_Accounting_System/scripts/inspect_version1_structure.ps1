# inspect_version1_structure.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\سجل الايرادات والمصروفات (version 1).xlsb.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

Write-Host "=== Sheets in Original File ==="
Write-Host "Count: $($wb.Sheets.Count)"

foreach ($sheet in $wb.Sheets) {
    Write-Host "Sheet Name: '$($sheet.Name)' | Rows: $($sheet.UsedRange.Rows.Count) | Cols: $($sheet.UsedRange.Columns.Count)"
}

$s1 = $wb.Sheets.Item(1)
Write-Host ""
Write-Host "=== Sample Headers from Sheet 1 ($($s1.Name)) ==="
for ($c = 1; $c -le 14; $c++) {
    $val = $s1.Cells.Item(3, $c).Text
    Write-Host "Col ${c}: '$val'"
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
