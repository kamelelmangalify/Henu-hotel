# inspect_formatting.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$filePath = "D:\Henu\سجل الايرادات والمصروفات.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)
$sheet = $wb.Sheets.Item("Sheet1")

Write-Host "=== Formats & Formulas in Sheet1 ==="
for ($r = 1; $r -le 10; $r++) {
    Write-Host "--- Row $r ---"
    for ($c = 1; $c -le 14; $c++) {
        $cell = $sheet.Cells.Item($r, $c)
        $text = $cell.Text
        $formula = $cell.Formula
        if ($formula -or $text) {
            Write-Host "  Col $c`: Text='$text' | Formula='$formula'"
        }
    }
}

Write-Host ""
Write-Host "--- Row 35 (الاجمالي) ---"
for ($c = 1; $c -le 14; $c++) {
    $cell = $sheet.Cells.Item(35, $c)
    $text = $cell.Text
    $formula = $cell.Formula
    if ($formula -or $text) {
        Write-Host "  Col $c`: Text='$text' | Formula='$formula'"
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
