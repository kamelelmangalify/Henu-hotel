# extract_advances.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\سجل الايرادات والمصروفات (version 1).xlsb.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

Write-Host "=== Sheets in '$filePath' ==="
Write-Host "Count: $($wb.Sheets.Count)"

$advances = [System.Collections.Generic.List[PSObject]]::new()

foreach ($sheet in $wb.Sheets) {
    $sName = $sheet.Name
    $lastRow = $sheet.UsedRange.Rows.Count
    Write-Host "Sheet '$sName': $lastRow rows"

    for ($r = 1; $r -le $lastRow; $r++) {
        $rowNum   = $sheet.Cells.Item($r, 1).Text.Trim()
        $dateVal  = $sheet.Cells.Item($r, 2).Text.Trim()
        $desc     = $sheet.Cells.Item($r, 5).Text.Trim()
        $recipient= $sheet.Cells.Item($r, 6).Text.Trim()
        $expense  = $sheet.Cells.Item($r, 7).Text.Trim()
        $note     = $sheet.Cells.Item($r, 12).Text.Trim()

        if ($desc -match "سلف|سلفة" -or $recipient -match "سلف|سلفة" -or $note -match "سلف|سلفة") {
            $expClean = ($expense -replace "[^\d\.]", "")
            $expAmt = if ($expClean) { $expClean -as [decimal] } else { 0 }

            $advances.Add([PSCustomObject]@{
                Sheet       = $sName
                Row         = $r
                Number      = $rowNum
                Date        = $dateVal
                Description = $desc
                Recipient   = $recipient
                Amount      = $expAmt
                Notes       = $note
            })
        }
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host ""
Write-Host "=== Found $($advances.Count) advance transactions ==="
foreach ($a in $advances) {
    Write-Host "[$($a.Sheet)-R$($a.Row)] Date: '$($a.Date)' | Desc: '$($a.Description)' | Recipient: '$($a.Recipient)' | Amt: $($a.Amount) EGP | Notes: '$($a.Notes)'"
}
