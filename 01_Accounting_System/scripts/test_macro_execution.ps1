# test_macro_execution.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$outPath = "D:\Henu\سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $outPath).Path)
$sheet1 = $wb.Sheets.Item("01-يناير")
$sheet1.Activate()

$initialRows = $sheet1.UsedRange.Rows.Count
Write-Host "Initial Used Rows in '01-يناير': $initialRows"

try {
    # تشغيل الماكرو برمجياً للاختبار
    $excel.Run("AddNewRowToCurrentSheet")
    
    $newRows = $sheet1.UsedRange.Rows.Count
    Write-Host "✅ Macro Executed SUCCESSFULY! New Used Rows: $newRows"
    
    # فحص المعادلة في الصف المدرج حديثاً
    $totalRow = 36
    $totGFormula = $sheet1.Cells.Item($totalRow, 7).Formula
    Write-Host "Formula in Totals Row (Col G): $totGFormula"
    
} catch {
    Write-Host "❌ Macro Error: $($_.Exception.Message)"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
