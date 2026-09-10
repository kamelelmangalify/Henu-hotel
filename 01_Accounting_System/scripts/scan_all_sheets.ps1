# scan_all_sheets.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\سجل الايرادات والمصروفات (version 1).xlsb.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

foreach ($sheet in $wb.Sheets) {
    $sName = $sheet.Name
    $lastRow = $sheet.UsedRange.Rows.Count
    Write-Host "=========================================="
    Write-Host "📋 SHEET: '$sName' ($lastRow rows)"
    Write-Host "=========================================="
    
    for ($r = 4; $r -le $lastRow; $r++) {
        $num   = $sheet.Cells.Item($r, 1).Text.Trim()
        $date  = $sheet.Cells.Item($r, 2).Text.Trim()
        $desc  = $sheet.Cells.Item($r, 5).Text.Trim()
        $rec   = $sheet.Cells.Item($r, 6).Text.Trim()
        $exp   = $sheet.Cells.Item($r, 7).Text.Trim()
        $inc   = $sheet.Cells.Item($r, 8).Text.Trim()
        $bal   = $sheet.Cells.Item($r, 10).Text.Trim()
        $note  = $sheet.Cells.Item($r, 12).Text.Trim()

        if ($desc -or $exp -or $inc) {
            Write-Host "Row $r [Num:$num | Date:$date]: Desc='$desc' | Rec='$rec' | Exp=$exp | Inc=$inc | Bal=$bal | Note='$note'"
        }
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
