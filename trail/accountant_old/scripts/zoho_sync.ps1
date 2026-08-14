# =============================================================
# zoho_sync.ps1  —  رفع المعاملات غير المُزامنة إلى Zoho Books
# الاستخدام:
#   pwsh -File zoho_sync.ps1
#   pwsh -File zoho_sync.ps1 -Mode date:2026-08-06
# =============================================================
#Requires -Version 7
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

param(
    [string]$Mode = "all"   # all | date:yyyy-MM-dd
)

. "$PSScriptRoot\lib\zoho_api.ps1"

# ── Account IDs ثابتة (من chart of accounts) ─────────────────
$ACCOUNT = @{
    OtherExpenses   = "628287000000000460"   # Other Expenses
    Salaries        = "628287000000000445"   # Salaries and Employee Wages
    Repairs         = "628287000000000437"   # Repairs and Maintenance
    Utilities       = "628287000000000430"   # Utilities
    Housekeeping    = "628287000000093003"   # Housekeeping Expenses
    OwnersEquity    = "628287000000000382"   # Owner's Equity
    Cash            = "628287000000000388"   # Cash (Petty Cash)
}

# ── تحديد حساب المصروف حسب الوصف والفئة ──────────────────────
function Get-ExpenseAccountId {
    param([string]$Category, [string]$Description)
    $d = $Description.ToLower()
    if ($d -match "راتب|مرتب|سلفة|سلف")     { return $ACCOUNT.Salaries }
    if ($d -match "كهرباء|مياه|غاز|انترنت") { return $ACCOUNT.Utilities }
    if ($d -match "صيانة|تصليح|تكييف")      { return $ACCOUNT.Repairs }
    if ($d -match "غسيل|تنظيف|نظافة")       { return $ACCOUNT.Housekeeping }
    switch ($Category) {
        "موردون"        { return $ACCOUNT.OtherExpenses }
        "سلف موظفين"   { return $ACCOUNT.Salaries }
        default         { return $ACCOUNT.OtherExpenses }
    }
}

# ── تحميل البيانات ────────────────────────────────────────────
$hdrs   = Get-ZohoHeaders
$ledger = Get-Ledger

# ── تصفية المعاملات غير المُزامنة ─────────────────────────────
$allTx  = @($ledger.transactions)
$toSync = @($allTx | Where-Object {
    [string]::IsNullOrEmpty($_.zoho_id)
})

# تصفية حسب التاريخ إن طُلب
if ($Mode -match "^date:(.+)$") {
    $filterDate = $Matches[1]
    $toSync = @($toSync | Where-Object { $_.date -eq $filterDate })
}

Write-Host "============================================"
Write-Host "  🔄 مزامنة مع Zoho Books"
Write-Host "  معاملات للرفع: $($toSync.Count)"
Write-Host "============================================"

$synced = 0
$failed = 0
$now    = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

foreach ($tx in $toSync) {
    Write-Host ""
    Write-Host "  ▶ $($tx.description) | $($tx.amount) ج | $($tx.date)"

    $zohoId = $null

    # ── مصروف ────────────────────────────────────────────────
    if ($tx.type -eq "مصروف") {
        $acctId  = Get-ExpenseAccountId -Category $tx.category -Description $tx.description
        $payMode = switch ($tx.payment_method) {
            "نقدي"  { "Cash" }
            "شبكة"  { "CreditCard" }
            "تحويل" { "BankTransfer" }
            default { "Cash" }
        }

        # إذا كان له مورد → نبحث عنه أو ننشئه
        $vendorId = $null
        if ($tx.category -eq "موردون" -and $tx.description -match "حساب (.+)$") {
            $vendorName = $Matches[1].Trim()
            $vendorId   = Get-OrCreateContact -Name $vendorName -Type "vendor" -Headers $hdrs
        }

        $zohoId = New-ZohoExpense `
            -Date        $tx.date `
            -Amount      $tx.amount `
            -AccountId   $acctId `
            -Description $tx.description `
            -PaymentMode $payMode `
            -VendorId    ($vendorId ?? "") `
            -Headers     $hdrs

        if ($zohoId) {
            Write-Host "  ✅ مصروف → Expense $zohoId"
            $synced++
        } else {
            Write-Host "  ❌ فشل رفع المصروف"
            $failed++
        }
    }

    # ── إيراد ─────────────────────────────────────────────────
    elseif ($tx.type -eq "إيراد") {
        $custName = if ($tx.description -match "من (.+)$") { $Matches[1].Trim() } else { "نزيل هوستل الأهرامات" }
        $custId   = Get-OrCreateContact -Name $custName -Type "customer" -Headers $hdrs
        $payMode  = switch ($tx.payment_method) {
            "نقدي"  { "Cash" }
            "شبكة"  { "CreditCard" }
            "تحويل" { "BankTransfer" }
            default { "Cash" }
        }

        if ($custId) {
            $zohoId = New-ZohoInvoiceWithPayment `
                -CustomerId  $custId `
                -Date        $tx.date `
                -Amount      $tx.amount `
                -Description $tx.description `
                -PaymentMode $payMode `
                -Headers     $hdrs

            if ($zohoId) {
                Write-Host "  ✅ إيراد → Invoice $zohoId"
                $synced++
            } else {
                Write-Host "  ❌ فشل إنشاء الفاتورة"
                $failed++
            }
        } else {
            Write-Host "  ❌ فشل إنشاء العميل"
            $failed++
        }
    }

    # ── تمويل المالك → قيد يومي ──────────────────────────────
    elseif ($tx.type -eq "تمويل المالك") {
        $zohoId = New-ZohoJournalEntry `
            -Date            $tx.date `
            -Amount          $tx.amount `
            -DebitAccountId  $ACCOUNT.Cash `
            -CreditAccountId $ACCOUNT.OwnersEquity `
            -Notes           "$($tx.description) — تمويل من المالك" `
            -Headers         $hdrs

        if ($zohoId) {
            Write-Host "  ✅ تمويل المالك → Journal $zohoId"
            $synced++
        } else {
            Write-Host "  ❌ فشل إنشاء القيد"
            $failed++
        }
    }

    # ── تحديث zoho_id في الـ Ledger ──────────────────────────
    if ($zohoId) {
        foreach ($t in $ledger.transactions) {
            if ($t.id -eq $tx.id) {
                $t | Add-Member -NotePropertyName "zoho_id"        -NotePropertyValue $zohoId -Force
                $t | Add-Member -NotePropertyName "zoho_synced_at" -NotePropertyValue $now    -Force
                break
            }
        }
    }

    Start-Sleep -Milliseconds 400
}

# ── حفظ الـ Ledger ────────────────────────────────────────────
Save-Ledger -Ledger $ledger

Write-Host ""
Write-Host "============================================"
Write-Host "  ✅ رُفع لـ Zoho : $synced معاملة"
Write-Host "  ❌ فشل         : $failed معاملة"
Write-Host "============================================"