
# import_hostel_temp.ps1
# استيراد مخصص من ملف hostel_temp.xlsx بناءً على بنيته الفعلية
# الرأس في صف 3: C1=رقم, C2=التاريخ, C4=رقم الاذن, C5=البيان, C6=الجهة, C7=مصروف, C8=ايراد, C9=رقم الفاتورة, C12=ملاحظات
param(
    [string]$ExcelPath  = "D:\Henu\hostel_temp.xlsx",
    [string]$LedgerPath = "D:\Henu\accountant\memory\ledger.json",
    [string]$ScriptsPath = "D:\Henu\accountant\scripts",
    [string]$EnteredBy  = "استيراد Excel"
)

Write-Host "============================================"
Write-Host "  استيراد مخصص — هوستل الأهرامات"
Write-Host "  الملف: " + $ExcelPath
Write-Host "============================================"

$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false
$wb = $xl.Workbooks.Open($ExcelPath)
$ws = $wb.Sheets.Item(1)

$lastRow = $ws.UsedRange.Rows.Count

# الأعمدة الثابتة (بناءً على الفحص)
# C1=رقم, C2=تاريخ, C3=رصيد افتتاحي, C4=رقم اذن, C5=بيان, C6=جهة مستلمة
# C7=مصروف, C8=ايراد, C9=فاتورة, C10=رصيد, C11=تنبيه, C12=ملاحظات

$imported = 0
$skipped  = 0
$errors   = 0

# البيانات تبدأ من الصف 4
for ($row = 4; $row -le $lastRow; $row++) {
    $rawExpense = $ws.Cells.Item($row, 7).Value2
    $rawIncome  = $ws.Cells.Item($row, 8).Value2
    $rawDesc    = $ws.Cells.Item($row, 5).Text.Trim()

    # تجاهل الصفوف الفارغة من البيان والمبلغ
    $hasExpense = ($rawExpense -ne $null -and $rawExpense -ne "" -and [double]$rawExpense -gt 0)
    $hasIncome  = ($rawIncome  -ne $null -and $rawIncome  -ne "" -and [double]$rawIncome  -gt 0)
    if (-not $hasExpense -and -not $hasIncome) { continue }
    if ($rawDesc -eq "" -or $rawDesc -eq $null) { continue }

    # التاريخ
    $rawDate = $ws.Cells.Item($row, 2).Value2
    if ($rawDate -ne $null -and $rawDate -ne "") {
        try {
            $txDate = [datetime]::FromOADate([double]$rawDate).ToString("yyyy-MM-dd")
        } catch {
            $txDate = Get-Date -Format "yyyy-MM-dd"
        }
    } else {
        $txDate = Get-Date -Format "yyyy-MM-dd"
    }

    $txRef    = $ws.Cells.Item($row, 4).Text.Trim()
    $txJihah  = $ws.Cells.Item($row, 6).Text.Trim()
    $txInvoice= $ws.Cells.Item($row, 9).Text.Trim()
    $txNotes  = $ws.Cells.Item($row, 12).Text.Trim()
    if ($txRef -eq "" -or $txRef -eq $null) { $txRef = "-" }

    # دمج الجهة والفاتورة في الملاحظات
    $fullNotes = ""
    if ($txJihah   -ne "") { $fullNotes += "الجهة: " + $txJihah + " " }
    if ($txInvoice -ne "") { $fullNotes += "فاتورة: " + $txInvoice + " " }
    if ($txNotes   -ne "") { $fullNotes += $txNotes }
    $fullNotes = $fullNotes.Trim()

    # معالجة المصروف
    if ($hasExpense) {
        $txAmt  = [double]$rawExpense
        $txType = "مصروف"
        $txPay  = "نقدي"

        $output = & powershell -ExecutionPolicy Bypass -File "$ScriptsPath\add_transaction.ps1" `
            -Date $txDate -Type $txType -Amount $txAmt `
            -Description $rawDesc -Category "نثريات" `
            -Reference $txRef -PaymentMethod $txPay `
            -EnteredBy $EnteredBy -Notes $fullNotes `
            -LedgerPath $LedgerPath 2>&1

        $outStr = $output -join "`n"
        if ($outStr -match "SUCCESS:(.+)") {
            $imported++
            Write-Host ("  OK صف " + $row + " [مصروف] " + $rawDesc + " " + $txAmt + " ج → " + $Matches[1].Trim())
        } elseif ($outStr -match "DUPLICATE:(.+)") {
            $skipped++
            Write-Host ("  DUP صف " + $row + " [مصروف] " + $rawDesc)
        } else {
            $errors++
            Write-Host ("  ERR صف " + $row + " [مصروف] " + $rawDesc)
            Write-Host $outStr
        }
    }

    # معالجة الإيراد
    if ($hasIncome) {
        $txAmt  = [double]$rawIncome
        $txType = "إيراد"
        $txPay  = "تحويل"
        if ($rawDesc -match "نقد|نقدي|كاش") { $txPay = "نقدي" }

        $output = & powershell -ExecutionPolicy Bypass -File "$ScriptsPath\add_transaction.ps1" `
            -Date $txDate -Type $txType -Amount $txAmt `
            -Description $rawDesc -Category "إيرادات" `
            -Reference $txRef -PaymentMethod $txPay `
            -EnteredBy $EnteredBy -Notes $fullNotes `
            -LedgerPath $LedgerPath 2>&1

        $outStr = $output -join "`n"
        if ($outStr -match "SUCCESS:(.+)") {
            $imported++
            Write-Host ("  OK صف " + $row + " [إيراد] " + $rawDesc + " " + $txAmt + " ج → " + $Matches[1].Trim())
        } elseif ($outStr -match "DUPLICATE:(.+)") {
            $skipped++
            Write-Host ("  DUP صف " + $row + " [إيراد] " + $rawDesc)
        } else {
            $errors++
            Write-Host ("  ERR صف " + $row + " [إيراد] " + $rawDesc)
            Write-Host $outStr
        }
    }
}

$wb.Close($false)
$xl.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($xl) | Out-Null

Write-Host ""
Write-Host "============================================"
Write-Host "  ملخص الاستيراد"
Write-Host ("  مستورد جديد : " + $imported)
Write-Host ("  مكرر        : " + $skipped)
Write-Host ("  اخطاء       : " + $errors)
Write-Host "============================================"
