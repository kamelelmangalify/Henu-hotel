# ============================================================
# import_from_excel.ps1
# يستورد المعاملات من ملف Excel ويتحقق من التكرار
# الاستخدام: .\import_from_excel.ps1 -ExcelPath "D:\Henu\hostel_temp.xlsx" -SheetName "Sheet1"
# ============================================================
param(
    [string]$ExcelPath   = "D:\Henu\hostel_temp.xlsx",
    [string]$SheetName   = "",
    [string]$LedgerPath  = "D:\Henu\accountant\memory\ledger.json",
    [string]$ScriptsPath = "D:\Henu\accountant\scripts",
    [string]$EnteredBy   = "استيراد Excel"
)

Write-Host "============================================"
Write-Host "  استيراد المعاملات من Excel"
Write-Host "  الملف: $ExcelPath"
Write-Host "============================================"

# ── Open Excel ────────────────────────────────────────────────
$xl  = New-Object -ComObject Excel.Application
$xl.Visible = $false; $xl.DisplayAlerts = $false
$wb  = $xl.Workbooks.Open($ExcelPath)

# Pick sheet
if ($SheetName -ne "") {
    $ws = $wb.Sheets.Item($SheetName)
} else {
    $ws = $wb.Sheets.Item(1)
    Write-Host "الشيت المستخدم: $($ws.Name)"
}

# ── Detect headers in row 1 ───────────────────────────────────
$lastCol  = $ws.UsedRange.Columns.Count
$lastRow  = $ws.UsedRange.Rows.Count
$headers  = @{}
for ($c = 1; $c -le $lastCol; $c++) {
    $h = $ws.Cells.Item(1, $c).Text.Trim()
    if ($h -ne "") { $headers[$h] = $c }
}
Write-Host "الأعمدة المكتشفة: $($headers.Keys -join ', ')"

# Column mapping — Arabic or English header detection
function getCol($names) {
    foreach ($n in $names) {
        if ($headers.ContainsKey($n)) { return $headers[$n] }
    }
    return 0
}
$colDate    = getCol @("التاريخ","Date","تاريخ")
$colDesc    = getCol @("البيان","Description","الوصف","بيان","المصروف")
$colAmount  = getCol @("المبلغ","Amount","مبلغ","مبلغ مصروف (ج)","مصروف (ج)")
$colType    = getCol @("النوع","Type","نوع")
$colCat     = getCol @("الفئة","Category","القسم","البند")
$colRef     = getCol @("المرجع","Reference","رقم","رقم الاذن","رقم اذن الصرف")
$colPay     = getCol @("وسيلة الدفع","Payment","طريقة الدفع","الدفع")
$colNotes   = getCol @("ملاحظات","Notes","ملاحظة")

Write-Host "تاريخ: col$colDate | بيان: col$colDesc | مبلغ: col$colAmount"

# ── Process rows ──────────────────────────────────────────────
$imported  = 0
$skipped   = 0
$errors    = 0
$results   = @()

for ($row = 2; $row -le $lastRow; $row++) {
    # Skip empty rows
    $rawAmount = if ($colAmount -gt 0) { $ws.Cells.Item($row, $colAmount).Value2 } else { $null }
    if ($rawAmount -eq $null -or $rawAmount -eq 0 -or $rawAmount -eq "") { continue }

    $txDate  = if ($colDate   -gt 0) { try { [datetime]::FromOADate($ws.Cells.Item($row,$colDate).Value2).ToString("yyyy-MM-dd") } catch { $ws.Cells.Item($row,$colDate).Text } } else { Get-Date -Format "yyyy-MM-dd" }
    $txDesc  = if ($colDesc   -gt 0) { $ws.Cells.Item($row,$colDesc).Text.Trim() } else { "غير محدد" }
    $txAmt   = [double]$rawAmount
    $txType  = if ($colType   -gt 0) { $ws.Cells.Item($row,$colType).Text.Trim() } else { if ($txAmt -lt 0) {"إيراد"} else {"مصروف"} }
    $txCat   = if ($colCat    -gt 0) { $ws.Cells.Item($row,$colCat).Text.Trim() } else { "عام" }
    $txRef   = if ($colRef    -gt 0) { $ws.Cells.Item($row,$colRef).Text.Trim() } else { "" }
    $txPay   = if ($colPay    -gt 0) { $ws.Cells.Item($row,$colPay).Text.Trim() } else { "نقدي" }
    $txNotes = if ($colNotes  -gt 0) { $ws.Cells.Item($row,$colNotes).Text.Trim() } else { "" }

    # Clean up
    if ($txType -eq "") { $txType = "مصروف" }
    if ($txCat  -eq "") { $txCat  = "عام" }
    if ($txDesc -eq "") { $txDesc = "غير محدد" }
    $txAmt = [Math]::Abs($txAmt)

    # Call add_transaction.ps1
    $output = & powershell -ExecutionPolicy Bypass -File "$ScriptsPath\add_transaction.ps1" `
        -Date $txDate -Type $txType -Amount $txAmt `
        -Description $txDesc -Category $txCat `
        -Reference $txRef -PaymentMethod $txPay `
        -EnteredBy $EnteredBy -Notes $txNotes `
        -LedgerPath $LedgerPath 2>&1

    $outStr = $output -join "`n"

    if ($outStr -match "SUCCESS:(.+)") {
        $imported++
        $txId = $Matches[1].Trim()
        Write-Host "  ✅ صف $row — تم: $txDesc ($txAmt ج) → $txId"
        $results += [PSCustomObject]@{Row=$row; Status="imported"; Desc=$txDesc; Amount=$txAmt; ID=$txId}
    } elseif ($outStr -match "DUPLICATE:(.+)") {
        $skipped++
        Write-Host "  ⏭️  صف $row — مكرر: $txDesc ($txAmt ج)"
        $results += [PSCustomObject]@{Row=$row; Status="duplicate"; Desc=$txDesc; Amount=$txAmt; ID=$Matches[1].Trim()}
    } else {
        $errors++
        Write-Host "  ❌ صف $row — خطأ: $txDesc"
        $results += [PSCustomObject]@{Row=$row; Status="error"; Desc=$txDesc; Amount=$txAmt; ID=""}
    }
}

$wb.Close($false)
$xl.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($xl) | Out-Null

# ── Summary ───────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================"
Write-Host "  ملخص الاستيراد"
Write-Host "  ✅ مستورد جديد : $imported"
Write-Host "  ⏭️  مكرر (تم تجاهله): $skipped"
Write-Host "  ❌ أخطاء       : $errors"
Write-Host "============================================"
