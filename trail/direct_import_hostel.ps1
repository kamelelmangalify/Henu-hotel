
# direct_import_hostel.ps1
# استيراد مباشر من hostel_temp.xlsx إلى ledger.json بدون استدعاء سكريبت فرعي
param(
    [string]$ExcelPath  = "D:\Henu\hostel_temp.xlsx",
    [string]$LedgerPath = "D:\Henu\accountant\memory\ledger.json",
    [string]$EnteredBy  = "استيراد Excel"
)

Write-Host "============================================"
Write-Host "  استيراد مباشر — هوستل الأهرامات"
Write-Host "============================================"

# تحميل الدفتر
$ledger = Get-Content $LedgerPath -Raw -Encoding UTF8 | ConvertFrom-Json

# فتح Excel
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false
$wb = $xl.Workbooks.Open($ExcelPath)
$ws = $wb.Sheets.Item(1)
$lastRow = $ws.UsedRange.Rows.Count

$imported = 0
$skipped  = 0
$errors   = 0

# بيانات الصفوف تبدأ من صف 4
# C1=رقم, C2=تاريخ, C4=رقم اذن, C5=بيان, C6=جهة, C7=مصروف, C8=ايراد, C9=فاتورة, C12=ملاحظات

function Add-Transaction {
    param($txDate, $txType, $txAmt, $txDesc, $txCat, $txRef, $txPay, $txNotes, $txJihah)

    # توليد معرف فريد
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $hashSrc = "$txDate|$txType|$txAmt|$txDesc"
    $hash = [Math]::Abs($hashSrc.GetHashCode())
    $txId = "TX-" + $timestamp + "-" + $hash

    # التحقق من التكرار
    foreach ($tx in $ledger.transactions) {
        if ($tx.date -eq $txDate -and
            [Math]::Abs($tx.amount - $txAmt) -lt 0.01 -and
            $tx.description -eq $txDesc -and
            $tx.type -eq $txType) {
            return "DUPLICATE:" + $tx.id
        }
    }

    # التحقق والتحذيرات
    $warnings = @()
    if ($txAmt -le 0)       { $warnings += "المبلغ صفر او سالب" }
    if ($txDesc -eq "")     { $warnings += "البيان فارغ" }
    if ($txDate -lt "2020-01-01") { $warnings += "تاريخ مشبوه" }
    if ($txAmt -gt 5000 -and $txPay -eq "نقدي") { $warnings += "مبلغ نقدي كبير (>5000 ج) يستوجب مراجعة المدير" }

    $fullNotes = ""
    if ($txJihah -ne "") { $fullNotes = "الجهة: " + $txJihah }
    if ($txNotes -ne "") { $fullNotes = ($fullNotes + " " + $txNotes).Trim() }

    $newTx = [PSCustomObject]@{
        id             = $txId
        date           = $txDate
        type           = $txType
        amount         = $txAmt
        description    = $txDesc
        category       = $txCat
        reference      = $txRef
        payment_method = $txPay
        entered_by     = $EnteredBy
        entered_at     = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        notes          = $fullNotes
        warnings       = ($warnings -join " | ")
        reviewed       = $false
        review_status  = if ($warnings.Count -gt 0) {"يستوجب مراجعة"} else {"موافق"}
    }

    $ledger.transactions += $newTx
    return "SUCCESS:" + $txId
}

for ($row = 4; $row -le $lastRow; $row++) {
    $rawExp  = $ws.Cells.Item($row, 7).Value2
    $rawInc  = $ws.Cells.Item($row, 8).Value2
    $rawDesc = $ws.Cells.Item($row, 5).Text.Trim()

    $hasExp = ($rawExp -ne $null -and "$rawExp" -ne "" -and [double]"$rawExp" -gt 0)
    $hasInc = ($rawInc -ne $null -and "$rawInc" -ne "" -and [double]"$rawInc" -gt 0)

    if (-not $hasExp -and -not $hasInc) { continue }
    if ($rawDesc -eq "" -or $rawDesc -eq $null) { continue }

    # التاريخ
    $rawDate = $ws.Cells.Item($row, 2).Value2
    if ($rawDate -ne $null -and "$rawDate" -ne "") {
        try {
            $txDate = [datetime]::FromOADate([double]"$rawDate").ToString("yyyy-MM-dd")
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
    if ($txRef -eq "") { $txRef = "-" }
    if ($txInvoice -ne "") { $txNotes = ("فاتورة:" + $txInvoice + " " + $txNotes).Trim() }

    if ($hasExp) {
        $res = Add-Transaction -txDate $txDate -txType "مصروف" -txAmt ([double]"$rawExp") -txDesc $rawDesc -txCat "نثريات" -txRef $txRef -txPay "نقدي" -txNotes $txNotes -txJihah $txJihah
        if ($res -match "^SUCCESS:") { $imported++; Write-Host ("  OK [مصروف] " + $rawDesc + " " + $rawExp + " ج — " + $res.Substring(8)) }
        elseif ($res -match "^DUPLICATE:") { $skipped++; Write-Host ("  DUP [مصروف] " + $rawDesc) }
        else { $errors++; Write-Host ("  ERR [مصروف] " + $rawDesc) }
    }
    if ($hasInc) {
        $payMethod = "تحويل"
        if ("$rawDesc" -match "نقد") { $payMethod = "نقدي" }
        $res = Add-Transaction -txDate $txDate -txType "إيراد" -txAmt ([double]"$rawInc") -txDesc $rawDesc -txCat "إيرادات" -txRef $txRef -txPay $payMethod -txNotes $txNotes -txJihah $txJihah
        if ($res -match "^SUCCESS:") { $imported++; Write-Host ("  OK [إيراد] " + $rawDesc + " " + $rawInc + " ج — " + $res.Substring(8)) }
        elseif ($res -match "^DUPLICATE:") { $skipped++; Write-Host ("  DUP [إيراد] " + $rawDesc) }
        else { $errors++; Write-Host ("  ERR [إيراد] " + $rawDesc) }
    }
}

$wb.Close($false)
$xl.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($xl) | Out-Null

# تحديث الدفتر
$ledger.meta.total_entries = $ledger.transactions.Count
$ledger.meta.last_updated  = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
$ledger | ConvertTo-Json -Depth 10 | Out-File $LedgerPath -Encoding UTF8

Write-Host ""
Write-Host "============================================"
Write-Host "  ملخص الاستيراد"
Write-Host ("  مستورد جديد : " + $imported)
Write-Host ("  مكرر        : " + $skipped)
Write-Host ("  اخطاء       : " + $errors)
Write-Host "============================================"
