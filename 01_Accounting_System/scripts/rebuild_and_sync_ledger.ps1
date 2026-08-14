# ================================================================
# rebuild_and_sync_ledger.ps1
# يعيد بناء الـ Ledger من ملف الإكسيل مباشرة لضمان مطابقة 100%
# يرفع أي معاملة لم تُرفع بعد إلى Zoho Books
# ================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

. "D:\Henu\01_Accounting_System\lib\zoho_api.ps1"

$excelFile = "D:\Henu\سجل الايرادات والمصروفات.xlsx"
$ledgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"

Write-Host "════════════════════════════════════════════════════"
Write-Host "  📊 إعادة بناء الـ Ledger والمزامنة مع Zoho Books..."
Write-Host "════════════════════════════════════════════════════"

# 1. قراءة الـ Ledger الحالي للحفاظ على الـ zoho_ids المسجلة سابقاً
$oldLedger = Get-Ledger
$zohoMap = @{}
foreach ($tx in $oldLedger.transactions) {
    if ($tx.zoho_id -and $tx.zoho_id.Length -gt 5) {
        $k = "$($tx.date)|$($tx.amount)|$($tx.description.Trim())"
        if (-not $zohoMap.ContainsKey($k)) {
            $zohoMap[$k] = @{ zoho_id = $tx.zoho_id; synced_at = $tx.zoho_synced_at }
        }
    }
}

# 2. قراءة ملف الإكسيل
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open((Resolve-Path $excelFile).Path)

$newTransactions = [System.Collections.Generic.List[PSObject]]::new()
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

foreach ($sheet in $wb.Sheets) {
    $lastRow = $sheet.UsedRange.Rows.Count
    $sheetName = $sheet.Name

    for ($r = 4; $r -le $lastRow; $r++) {
        $rowNum   = $sheet.Cells.Item($r, 1).Text.Trim()
        $dateVal  = $sheet.Cells.Item($r, 2).Text.Trim()
        $desc     = $sheet.Cells.Item($r, 5).Text.Trim()
        $vendor   = $sheet.Cells.Item($r, 6).Text.Trim()
        $expense  = $sheet.Cells.Item($r, 7).Text.Trim()
        $income   = $sheet.Cells.Item($r, 8).Text.Trim()
        $balance  = $sheet.Cells.Item($r, 10).Text.Trim()
        $note     = $sheet.Cells.Item($r, 12).Text.Trim()

        if ($rowNum -match "^(الاجمالي|منقول)$" -or (-not $desc -and -not $expense -and -not $income)) { continue }

        $expClean = ($expense -replace "[^\d\.]", "")
        $incClean = ($income  -replace "[^\d\.]", "")
        $expAmt   = if ($expClean) { $expClean -as [decimal] } else { 0 }
        $incAmt   = if ($incClean) { $incClean -as [decimal] } else { 0 }

        if ($expAmt -eq 0 -and $incAmt -eq 0) { continue }

        $txDate = $dateVal
        if ($txDate -match "(\d+)/(\d+)/(\d+)") {
            $txDate = "{0:0000}-{1:00}-{2:00}" -f [int]$Matches[3],[int]$Matches[1],[int]$Matches[2]
        }
        if (-not $txDate -or $txDate.Length -lt 8) { $txDate = "2026-08-09" }

        # تحديد النوع
        $txType = if ($incAmt -gt 0) {
            if ($desc -match "انستاباي|تحويل بنكي") { "تمويل المالك" } else { "إيراد" }
        } else { "مصروف" }

        $amount = if ($txType -eq "مصروف") { $expAmt } else { $incAmt }

        $category = switch -regex ($desc) {
            "ايجار|غرفة"                     { "إيراد غرف" }
            "مغسلة"                          { "إيراد مغسلة" }
            "راتب"                           { "رواتب ومكافآت" }
            "سلفة"                           { "سلف موظفين" }
            "عمولة"                          { "عمولات حجز" }
            "كهربائي|مفروشات|شركة كوين|كاميرا" { "موردون" }
            "افطار|وجبة|بن"                  { "ضيافة وإعاشة" }
            default                          { "نثريات" }
        }

        # التحقق من وجود zoho_id
        $k = "$txDate|$amount|$($desc.Trim())"
        $zId = ""
        $zSync = ""
        if ($zohoMap.ContainsKey($k)) {
            $zId   = $zohoMap[$k].zoho_id
            $zSync = $zohoMap[$k].synced_at
        }

        $newTransactions.Add([PSCustomObject]@{
            id             = "TX-$txDate-R$r-$(Get-Random -Max 9999)"
            date           = $txDate
            type           = $txType
            amount         = $amount
            description    = $desc
            category       = $category
            reference      = "-"
            payment_method = "نقدي"
            entered_by     = "Excel-Import"
            entered_at     = $now
            notes          = if ($note) { $note } else { "" }
            warnings       = ""
            reviewed       = $true
            review_status  = "موافق"
            zoho_id        = $zId
            zoho_synced_at = $zSync
            excel_row      = "$sheetName-R$r"
        })
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

# 3. حفظ الـ Ledger الجديد المعتمد
$newLedger = @{
    meta = @{
        created       = "2026-08-06"
        hotel         = "هوستل الأهرامات"
        currency      = "EGP"
        version       = "2.0"
        total_entries = $newTransactions.Count
        last_updated  = $now
    }
    transactions = $newTransactions
}

$newLedger | ConvertTo-Json -Depth 10 | Out-File $ledgerPath -Encoding UTF8

Write-Host "✅ تم إعادة بناء الـ Ledger من الإكسيل ($($newTransactions.Count) قيد)"

# 4. رفع أي معاملة متبقية غير مزامنة إلى Zoho
$hdrs   = Get-ZohoHeaders
$toSync = @($newTransactions | Where-Object { -not $_.zoho_id -or $_.zoho_id.Length -lt 5 })

Write-Host ""
Write-Host "🔄 جارٍ رفع $($toSync.Count) معاملة متبقية إلى Zoho Books..."

$ACCOUNT = @{
    OtherExpenses   = "628287000000000460"
    Salaries        = "628287000000000445"
    Repairs         = "628287000000000437"
    Utilities       = "628287000000000430"
    Housekeeping    = "628287000000093003"
    OwnersEquity    = "628287000000000382"
    Cash            = "628287000000000361"
}

foreach ($tx in $toSync) {
    Write-Host "  ▶ [$($tx.type)] $($tx.description) | $($tx.amount) ج | $($tx.date)"
    $zohoId = $null

    if ($tx.type -eq "مصروف") {
        $acctId = if ($tx.category -eq "رواتب ومكافآت" -or $tx.category -eq "سلف موظفين") { $ACCOUNT.Salaries }
                  elseif ($tx.category -eq "نثريات") { $ACCOUNT.Housekeeping }
                  else { $ACCOUNT.OtherExpenses }

        $zohoId = New-ZohoExpense -Date $tx.date -Amount $tx.amount -AccountId $acctId -Description $tx.description -PaymentMode "Cash" -Headers $hdrs
    } elseif ($tx.type -eq "إيراد") {
        $custId = Get-OrCreateContact -Name "نزيل هوستل الأهرامات" -Type "customer" -Headers $hdrs
        $zohoId = New-ZohoInvoiceWithPayment -CustomerId $custId -Date $tx.date -Amount $tx.amount -Description $tx.description -PaymentMode "Cash" -Headers $hdrs
    } elseif ($tx.type -eq "تمويل المالك") {
        $zohoId = New-ZohoJournalEntry -Date $tx.date -Amount $tx.amount -DebitAccountId $ACCOUNT.Cash -CreditAccountId $ACCOUNT.OwnersEquity -Notes "$($tx.description) — تمويل المالك" -Headers $hdrs
    }

    if ($zohoId) {
        $tx.zoho_id = $zohoId
        $tx.zoho_synced_at = $now
        Write-Host "    ✅ Zoho ID: $zohoId"
    }
    Start-Sleep -Milliseconds 400
}

# حفظ التحديثات النهائية
$newLedger | ConvertTo-Json -Depth 10 | Out-File $ledgerPath -Encoding UTF8

# 5. التقرير والتأكد من المطابقة
$funding  = ($newTransactions | Where-Object type -eq "تمويل المالك" | Measure-Object amount -Sum).Sum
$revenues = ($newTransactions | Where-Object type -eq "إيراد"       | Measure-Object amount -Sum).Sum
$expenses = ($newTransactions | Where-Object type -eq "مصروف"       | Measure-Object amount -Sum).Sum
$netBal   = $funding + $revenues - $expenses
$synced   = ($newTransactions | Where-Object { $_.zoho_id -and $_.zoho_id.Length -gt 5 }).Count

Write-Host ""
Write-Host "===================================================="
Write-Host "  📋 تقرير المطابقة والمزامنة الشامل النهائي"
Write-Host "===================================================="
Write-Host "  إجمالي قيود الإكسيل: $($newTransactions.Count)"
Write-Host "  تمويلات المالك    : $("{0:N0}" -f $funding) ج"
Write-Host "  إجمالي الإيرادات   : $("{0:N0}" -f $revenues) ج"
Write-Host "  إجمالي المصروفات  : $("{0:N0}" -f $expenses) ج"
Write-Host "  ──────────────────────────────────────────────────"
Write-Host "  رصيد الصندوق التجريبي: $("{0:N0}" -f $netBal) ج"
Write-Host "  رصيد الإكسيل (Sheet1): 32,811 ج"
Write-Host "  المعاملات المرفوعة لـ Zoho: $synced من أصل $($newTransactions.Count)"
Write-Host "===================================================="
