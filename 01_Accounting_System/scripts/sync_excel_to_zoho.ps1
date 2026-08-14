# ================================================================
# sync_excel_to_zoho.ps1
# يقرأ ملف الإكسيل ← يقارن بالـ Ledger ← يرفع الجديد لـ Zoho
# ويتحقق من مطابقة الأرصدة في كل مرحلة
#
# الاستخدام:
#   pwsh -File sync_excel_to_zoho.ps1
#   pwsh -File sync_excel_to_zoho.ps1 -DryRun   (بدون رفع فعلي)
# ================================================================
param(
    [string]$ExcelFile = "D:\Henu\سجل الايرادات والمصروفات.xlsx",
    [switch]$DryRun
)

#Requires -Version 7
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

. "D:\Henu\01_Accounting_System\lib\zoho_api.ps1"

# ── Account IDs ──────────────────────────────────────────────────
$ACCOUNT = @{
    OtherExpenses   = "628287000000000460"
    Salaries        = "628287000000000445"
    Repairs         = "628287000000000437"
    Utilities       = "628287000000000430"
    Housekeeping    = "628287000000093003"
    OwnersEquity    = "628287000000000382"
    Cash            = "628287000000000388"
    Commission      = "628287000000000460"
    FnB             = "628287000000000460"
}

function Get-ExpenseAccountId {
    param([string]$Category, [string]$Desc)
    $d = $Desc.ToLower()
    if ($d -match "راتب|مرتب|سلفة|سلف|مكافأة")   { return $ACCOUNT.Salaries }
    if ($d -match "كهرباء|مياه|غاز|انترنت|شحن")  { return $ACCOUNT.Utilities }
    if ($d -match "صيانة|تصليح|تكييف")             { return $ACCOUNT.Repairs }
    if ($d -match "غسيل|تنظيف|نظافة|سبلايز")       { return $ACCOUNT.Housekeeping }
    if ($d -match "عمولة")                          { return $ACCOUNT.Commission }
    if ($d -match "افطار|وجبة|اكل|ضيافة|بن")       { return $ACCOUNT.FnB }
    switch ($Category) {
        "موردون"          { return $ACCOUNT.OtherExpenses }
        "سلف موظفين"     { return $ACCOUNT.Salaries }
        "رواتب ومكافآت"  { return $ACCOUNT.Salaries }
        "عمولات حجز"     { return $ACCOUNT.Commission }
        "ضيافة وإعاشة"   { return $ACCOUNT.FnB }
        default           { return $ACCOUNT.OtherExpenses }
    }
}

function Get-TxCategory {
    param([string]$Desc)
    $d = $Desc.ToLower()
    if ($d -match "ايجار|غرفة|غرف")    { return "إيراد غرف" }
    if ($d -match "مغسلة|غسيل ملابس")  { return "إيراد مغسلة" }
    if ($d -match "راتب")               { return "راتب شهر 8" }
    if ($d -match "سلفة")               { return "سلف شهر 8" }
    if ($d -match "مكافأة")             { return "رواتب ومكافآت" }
    if ($d -match "عمولة")              { return "عمولات حجز" }
    if ($d -match "مفروشات|كوين")       { return "موردون" }
    if ($d -match "كهرباء|كاميرا|علاء الكهربائي") { return "موردون" }
    if ($d -match "افطار|وجبة|بن")      { return "ضيافة وإعاشة" }
    if ($d -match "سبلايز")             { return "نثريات" }
    if ($d -match "انستاباي|تحويل بنكي") { return "تمويل المالك" }
    return "نثريات"
}

# ══════════════════════════════════════════════════════════════════
# 1. قراءة الإكسيل بالكامل (كل الـ Sheets)
# ══════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "  📊 قراءة ملف الإكسيل..."
Write-Host "════════════════════════════════════════════════════"

$excel   = New-Object -ComObject Excel.Application
$excel.Visible        = $false
$excel.DisplayAlerts  = $false

# التأكد من وجود الملف
if (-not (Test-Path $ExcelFile)) {
    Write-Host "  ❌ الملف غير موجود: $ExcelFile"
    exit 1
}

$wb = $excel.Workbooks.Open((Resolve-Path $ExcelFile).Path)

$xlRows = [System.Collections.Generic.List[PSObject]]::new()

foreach ($sheet in $wb.Sheets) {
    $lastRow = $sheet.UsedRange.Rows.Count
    $lastCol = $sheet.UsedRange.Columns.Count
    $sheetName = $sheet.Name

    Write-Host "  📋 Sheet: '$sheetName' ($lastRow صف)"

    # تحديد صف العناوين (الصف 3)
    for ($r = 4; $r -le $lastRow; $r++) {
        $rowNum   = $sheet.Cells.Item($r, 1).Text.Trim()
        $dateVal  = $sheet.Cells.Item($r, 2).Text.Trim()
        $desc     = $sheet.Cells.Item($r, 5).Text.Trim()
        $vendor   = $sheet.Cells.Item($r, 6).Text.Trim()
        $expense  = $sheet.Cells.Item($r, 7).Text.Trim()
        $income   = $sheet.Cells.Item($r, 8).Text.Trim()
        $balance  = $sheet.Cells.Item($r, 10).Text.Trim()
        $note     = $sheet.Cells.Item($r, 12).Text.Trim()

        # تجاهل صف "الاجمالي" و"منقول" وأي صف غير رقمي بدون وصف
        if ($rowNum -match "^(الاجمالي|منقول)$") { continue }
        if (-not $desc -and -not $expense -and -not $income) { continue }

        # تحويل المبالغ بأمان
        $expClean = ($expense -replace "[^\d\.]", "")
        $incClean = ($income  -replace "[^\d\.]", "")
        $balClean = ($balance -replace "[^\d\.]", "")
        $expAmt = if ($expClean) { $expClean -as [decimal] } else { 0 }
        $incAmt = if ($incClean) { $incClean -as [decimal] } else { 0 }
        $bal    = if ($balClean) { $balClean -as [decimal] } else { 0 }

        # تحديد تاريخ القيد
        $txDate = $dateVal
        if ($txDate -match "(\d+)/(\d+)/(\d+)") {
            $txDate = "{0:0000}-{1:00}-{2:00}" -f [int]$Matches[3],[int]$Matches[1],[int]$Matches[2]
        }

        # تجاهل القيود الافتتاحية (رصيد افتتاحي = 0)
        if ($rowNum -eq "1" -and $expAmt -eq 0 -and $incAmt -gt 0 -and $desc -eq "") { continue }

        # تحديد النوع
        $txType = if ($incAmt -gt 0) {
            $cat = Get-TxCategory -Desc $desc
            if ($cat -eq "تمويل المالك") { "تمويل المالك" } else { "إيراد" }
        } else { "مصروف" }

        $amount = if ($txType -eq "مصروف") { $expAmt } else { $incAmt }

        if ($amount -eq 0) { continue }

        $xlRows.Add([PSCustomObject]@{
            xl_row    = "$sheetName-R$r"
            date      = $txDate
            desc      = $desc
            vendor    = $vendor
            type      = $txType
            amount    = $amount
            balance   = $bal
            note      = $note
            category  = Get-TxCategory -Desc $desc
            sheet     = $sheetName
        })
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "  ✅ قُرئ $($xlRows.Count) قيد من الإكسيل"

# ══════════════════════════════════════════════════════════════════
# 2. مقارنة مع الـ Ledger — اكتشاف الجديد
# ══════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "  🔍 مقارنة مع الـ Ledger المحلي..."
Write-Host "════════════════════════════════════════════════════"

$ledger = Get-Ledger
$existingTxns = @($ledger.transactions)

# بناء key فريد لكل قيد موجود (التاريخ + المبلغ + جزء من الوصف)
$existingKeys = @{}
foreach ($tx in $existingTxns) {
    $key = "$($tx.date)|$($tx.amount)|$($tx.description.Substring(0,[Math]::Min(10,$tx.description.Length)))"
    $existingKeys[$key] = $tx.id
}

$newRows   = [System.Collections.Generic.List[PSObject]]::new()
$matchRows = [System.Collections.Generic.List[PSObject]]::new()

foreach ($row in $xlRows) {
    if (-not $row.desc) { continue }
    $key = "$($row.date)|$($row.amount)|$($row.desc.Substring(0,[Math]::Min(10,$row.desc.Length)))"
    if ($existingKeys.ContainsKey($key)) {
        $matchRows.Add($row)
    } else {
        $newRows.Add($row)
    }
}

Write-Host "  ✅ مطابق في الـ Ledger : $($matchRows.Count) قيد"
Write-Host "  🆕 قيود جديدة للإضافة : $($newRows.Count) قيد"

if ($newRows.Count -gt 0) {
    Write-Host ""
    Write-Host "  القيود الجديدة:"
    foreach ($r in $newRows) {
        Write-Host "    [$($r.type)] $($r.date) | $($r.desc) | $("{0:N0}" -f $r.amount) ج"
    }
}

# ══════════════════════════════════════════════════════════════════
# 3. التحقق من مطابقة الأرصدة (الإكسيل vs الـ Ledger الحالي)
# ══════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "  ⚖️  التحقق من مطابقة الأرصدة..."
Write-Host "════════════════════════════════════════════════════"

# آخر رصيد في الإكسيل (Sheet1 منقول أو آخر صف فيه رصيد)
$lastXlBalance = ($xlRows | Where-Object { $_.balance -gt 0 } | Select-Object -Last 1).balance
$xlIncome  = ($xlRows | Where-Object { $_.type -ne "مصروف" } | Measure-Object amount -Sum).Sum
$xlExpense = ($xlRows | Where-Object { $_.type -eq "مصروف" } | Measure-Object amount -Sum).Sum

Write-Host "  📊 الإكسيل — آخر رصيد متبقي : $("{0:N0}" -f $lastXlBalance) ج"
Write-Host "  📊 الإكسيل — إجمالي الإيرادات: $("{0:N0}" -f $xlIncome) ج"
Write-Host "  📊 الإكسيل — إجمالي المصروفات: $("{0:N0}" -f $xlExpense) ج"

$ldgFunding = ($existingTxns | Where-Object type -eq "تمويل المالك" | Measure-Object amount -Sum).Sum
$ldgRev     = ($existingTxns | Where-Object type -eq "إيراد"         | Measure-Object amount -Sum).Sum
$ldgExp     = ($existingTxns | Where-Object type -eq "مصروف"         | Measure-Object amount -Sum).Sum
$ldgBalance = $ldgFunding + $ldgRev - $ldgExp

Write-Host "  📒 Ledger — رصيد الصندوق    : $("{0:N0}" -f $ldgBalance) ج"

if ($newRows.Count -gt 0) {
    $newRev = ($newRows | Where-Object { $_.type -ne "مصروف" } | Measure-Object amount -Sum).Sum
    $newExp = ($newRows | Where-Object { $_.type -eq "مصروف"  } | Measure-Object amount -Sum).Sum
    $projBalance = $ldgBalance + $newRev - $newExp
    Write-Host "  📒 Ledger بعد الإضافة       : $("{0:N0}" -f $projBalance) ج"

    if ([math]::Abs($projBalance - $lastXlBalance) -lt 1) {
        Write-Host "  ✅ ستتطابق الأرصدة بعد الإضافة"
    } else {
        Write-Host "  ⚠️  فرق متوقع: $($projBalance - $lastXlBalance) ج — يرجى المراجعة"
    }
} else {
    if ([math]::Abs($ldgBalance - $lastXlBalance) -lt 1) {
        Write-Host "  ✅ الأرصدة متطابقة تماماً!"
    } else {
        Write-Host "  ⚠️  فرق: $($ldgBalance - $lastXlBalance) ج"
    }
}

# ══════════════════════════════════════════════════════════════════
# 4. إضافة القيود الجديدة للـ Ledger وZoho
# ══════════════════════════════════════════════════════════════════
if ($newRows.Count -eq 0) {
    Write-Host ""
    Write-Host "  ℹ️  لا توجد قيود جديدة للمزامنة."
    exit 0
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════"
if ($DryRun) {
    Write-Host "  🔍 وضع المعاينة (DryRun) — لن يتم الرفع الفعلي"
} else {
    Write-Host "  🚀 رفع القيود الجديدة لـ Zoho Books..."
}
Write-Host "════════════════════════════════════════════════════"

$hdrs   = Get-ZohoHeaders
$synced = 0
$failed = 0
$now    = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

foreach ($row in $newRows) {
    Write-Host ""
    Write-Host "  ▶ [$($row.type)] $($row.desc) | $("{0:N0}" -f $row.amount) ج | $($row.date)"

    # إنشاء قيد جديد في الـ Ledger
    $newTx = [PSCustomObject]@{
        id             = "TX-$((Get-Date -Format 'yyyyMMddHHmmss'))-XL$(Get-Random -Max 999)"
        date           = $row.date
        type           = $row.type
        amount         = $row.amount
        description    = $row.desc
        category       = $row.category
        reference      = "-"
        payment_method = "نقدي"
        entered_by     = "Excel-Sync"
        entered_at     = $now
        notes          = if ($row.note) { $row.note } else { "" }
        warnings       = ""
        reviewed       = $true
        review_status  = "موافق"
        zoho_id        = ""
        zoho_synced_at = ""
        source_sheet   = $row.sheet
    }

    $zohoId = $null

    if (-not $DryRun) {
        Start-Sleep -Milliseconds 300

        if ($row.type -eq "مصروف") {
            $acctId = Get-ExpenseAccountId -Category $row.category -Desc $row.desc
            $vendorId = $null
            if ($row.vendor) {
                $vendorId = Get-OrCreateContact -Name $row.vendor -Type "vendor" -Headers $hdrs
            }
            $zohoId = New-ZohoExpense `
                -Date $row.date -Amount $row.amount `
                -AccountId $acctId -Description $row.desc `
                -PaymentMode "Cash" -VendorId ($vendorId ?? "") -Headers $hdrs

            if ($zohoId) { Write-Host "    ✅ Expense ID: $zohoId"; $synced++ }
            else         { Write-Host "    ❌ فشل الرفع"; $failed++ }

        } elseif ($row.type -eq "إيراد") {
            $custId = Get-OrCreateContact -Name "نزيل هوستل الأهرامات" -Type "customer" -Headers $hdrs
            $zohoId = New-ZohoInvoiceWithPayment `
                -CustomerId $custId -Date $row.date `
                -Amount $row.amount -Description $row.desc `
                -PaymentMode "Cash" -Headers $hdrs

            if ($zohoId) { Write-Host "    ✅ Invoice ID: $zohoId"; $synced++ }
            else         { Write-Host "    ❌ فشل الرفع"; $failed++ }

        } elseif ($row.type -eq "تمويل المالك") {
            $zohoId = New-ZohoJournalEntry `
                -Date $row.date -Amount $row.amount `
                -DebitAccountId $ACCOUNT.Cash -CreditAccountId $ACCOUNT.OwnersEquity `
                -Notes "$($row.desc) — تمويل من المالك أ. محمد مرسي" -Headers $hdrs

            if ($zohoId) { Write-Host "    ✅ Journal ID: $zohoId"; $synced++ }
            else         { Write-Host "    ❌ فشل الرفع"; $failed++ }
        }

        if ($zohoId) {
            $newTx.zoho_id        = $zohoId
            $newTx.zoho_synced_at = $now
        }
    } else {
        Write-Host "    [DryRun] سيتم رفعه كـ $($row.type)"
        $synced++
    }

    $ledger.transactions += $newTx
}

# ── تحديث الـ meta وحفظ الـ Ledger ──────────────────────────────
$ledger.meta.total_entries = $ledger.transactions.Count
$ledger.meta.last_updated  = $now
Save-Ledger -Ledger $ledger

# ══════════════════════════════════════════════════════════════════
# 5. التحقق النهائي من المطابقة
# ══════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "  📋 تقرير المطابقة النهائي"
Write-Host "════════════════════════════════════════════════════"

$ledger2   = Get-Ledger
$allTx2    = @($ledger2.transactions)
$f2        = ($allTx2 | Where-Object type -eq "تمويل المالك" | Measure-Object amount -Sum).Sum
$r2        = ($allTx2 | Where-Object type -eq "إيراد"         | Measure-Object amount -Sum).Sum
$e2        = ($allTx2 | Where-Object type -eq "مصروف"         | Measure-Object amount -Sum).Sum
$balance2  = $f2 + $r2 - $e2

Write-Host "  تمويلات المالك:    $("{0:N0}" -f $f2) ج"
Write-Host "  إجمالي الإيرادات:  $("{0:N0}" -f $r2) ج"
Write-Host "  إجمالي المصروفات:  $("{0:N0}" -f $e2) ج"
Write-Host "  ──────────────────────────────────────────────"
Write-Host "  رصيد النظام:       $("{0:N0}" -f $balance2) ج"
Write-Host "  رصيد الإكسيل:      $("{0:N0}" -f $lastXlBalance) ج"

$diff = [math]::Abs($balance2 - $lastXlBalance)
if ($diff -lt 1) {
    Write-Host "  ✅ تطابق تام — الأرصدة متطابقة 100%"
} else {
    Write-Host "  ⚠️  فرق: $diff ج — يرجى المراجعة اليدوية"
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "  ✅ رُفع لـ Zoho  : $synced معاملة"
Write-Host "  ❌ فشل           : $failed معاملة"
Write-Host "  📝 إجمالي الـ Ledger: $($allTx2.Count) قيد"
Write-Host "════════════════════════════════════════════════════"
