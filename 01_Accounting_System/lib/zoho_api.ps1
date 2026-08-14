# ================================================================
# zoho_api.ps1  —  مكتبة دوال Zoho Books API
# ================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$SCRIPT:ConfigPath = "D:\Henu\01_Accounting_System\memory\zoho_config.json"
$SCRIPT:LedgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"

# ── تحميل الإعدادات والـ Ledger ─────────────────────────────────
function Get-ZohoConfig {
    return Get-Content $SCRIPT:ConfigPath -Raw | ConvertFrom-Json
}

function Get-Ledger {
    return Get-Content $SCRIPT:LedgerPath -Raw | ConvertFrom-Json
}

function Save-Ledger {
    param($Ledger)
    $Ledger | ConvertTo-Json -Depth 10 | Set-Content $SCRIPT:LedgerPath -Encoding UTF8
}

# ── تجديد التوكن إن انتهت صلاحيته ──────────────────────────────
function Invoke-TokenRefreshIfNeeded {
    $cfg = Get-ZohoConfig
    $expiry = [datetime]::ParseExact($cfg.token_expiry, "yyyy-MM-dd HH:mm:ss", $null)

    if ((Get-Date) -gt $expiry.AddMinutes(-5)) {
        Write-Host "  ⟳ تجديد Zoho Access Token..."
        $body = "refresh_token=$($cfg.refresh_token)&client_id=$($cfg.client_id)&client_secret=$($cfg.client_secret)&grant_type=refresh_token"
        try {
            $resp = Invoke-RestMethod -Uri "https://accounts.zoho.com/oauth/v2/token" `
                -Method POST -Body $body `
                -ContentType "application/x-www-form-urlencoded" -TimeoutSec 20
            if ($resp.access_token) {
                $cfg.access_token = $resp.access_token
                $cfg.token_expiry = (Get-Date).AddSeconds($resp.expires_in).ToString("yyyy-MM-dd HH:mm:ss")
                $cfg | ConvertTo-Json | Set-Content $SCRIPT:ConfigPath -Encoding UTF8
                Write-Host "  ✅ تم تجديد التوكن"
            }
        } catch {
            Write-Host "  ❌ فشل تجديد التوكن: $($_.Exception.Message)"
        }
    }
}

# ── رأس الطلبات ─────────────────────────────────────────────────
function Get-ZohoHeaders {
    Invoke-TokenRefreshIfNeeded
    $cfg = Get-ZohoConfig
    return @{
        "Authorization" = "Zoho-oauthtoken $($cfg.access_token)"
        "Content-Type"  = "application/json;charset=UTF-8"
    }
}

function Get-OrgId {
    return (Get-ZohoConfig).organization_id
}

# ── جلب أو إنشاء جهة اتصال (عميل أو مورد) ──────────────────────
function Get-OrCreateContact {
    param(
        [string]$Name,
        [string]$Type,   # customer | vendor
        $Headers
    )
    $orgId = Get-OrgId
    $uri   = "https://www.zohoapis.com/books/v3/contacts?organization_id=$orgId&contact_type=$Type&search_text=$([uri]::EscapeDataString($Name))"

    try {
        $r = Invoke-RestMethod -Uri $uri -Headers $Headers -Method GET -TimeoutSec 15
        if ($r.contacts -and $r.contacts.Count -gt 0) {
            return $r.contacts[0].contact_id
        }
    } catch {}

    # إنشاء جديد
    $body = @{ contact_name = $Name; contact_type = $Type } | ConvertTo-Json -Compress
    try {
        $r2 = Invoke-RestMethod -Uri "https://www.zohoapis.com/books/v3/contacts?organization_id=$orgId" `
            -Headers $Headers -Method POST -Body $body -TimeoutSec 15
        if ($r2.contact) { return $r2.contact.contact_id }
    } catch {
        Write-Host "    ⚠️ فشل إنشاء $Type '$Name': $($_.Exception.Message)"
    }
    return $null
}

# ── إنشاء مصروف في Zoho ─────────────────────────────────────────
function New-ZohoExpense {
    param(
        [string]$Date,
        [decimal]$Amount,
        [string]$AccountId,
        [string]$Description,
        [string]$PaymentMode,
        [string]$VendorId = "",
        $Headers
    )
    $orgId = Get-OrgId
    $body  = @{
        date                    = $Date
        account_id              = $AccountId
        amount                  = $Amount
        description             = $Description
        payment_mode            = $PaymentMode
        paid_through_account_id = "628287000000000361"  # Petty Cash (الصحيح)
    }
    if ($VendorId) { $body.vendor_id = $VendorId }

    try {
        $r = Invoke-RestMethod `
            -Uri     "https://www.zohoapis.com/books/v3/expenses?organization_id=$orgId" `
            -Headers $Headers -Method POST `
            -Body    ($body | ConvertTo-Json -Compress) -TimeoutSec 20
        if ($r.expense) { return $r.expense.expense_id }
    } catch {
        $errMsg = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        Write-Host "    ⚠️ خطأ مصروف: $($errMsg.message ?? $_.Exception.Message)"
    }
    return $null
}

# ── إنشاء فاتورة + تحصيل في Zoho ────────────────────────────────
function New-ZohoInvoiceWithPayment {
    param(
        [string]$CustomerId,
        [string]$Date,
        [decimal]$Amount,
        [string]$Description,
        [string]$PaymentMode,
        [string]$IncomeAccountId = "628287000000093248",  # Room Revenue
        $Headers
    )
    $orgId = Get-OrgId

    # إنشاء الفاتورة مع تحديد حساب الإيراد
    $invBody = @{
        customer_id   = $CustomerId
        date          = $Date
        payment_terms = 0
        line_items    = @(@{
            description        = $Description
            rate               = $Amount
            quantity           = 1
            account_id         = $IncomeAccountId
        })
    } | ConvertTo-Json -Depth 5 -Compress

    try {
        $invR = Invoke-RestMethod `
            -Uri     "https://www.zohoapis.com/books/v3/invoices?organization_id=$orgId" `
            -Headers $Headers -Method POST -Body $invBody -TimeoutSec 20
        $invoiceId = $invR.invoice.invoice_id
        if (-not $invoiceId) { return $null }

        # تحصيل فوري عبر customerPayments
        $pmtBody = @{
            customer_id           = $CustomerId
            date                  = $Date
            amount                = $Amount
            payment_mode          = $PaymentMode
            deposit_to_account_id = "628287000000000361"  # Petty Cash
            invoices              = @(@{ invoice_id = $invoiceId; amount_applied = $Amount })
        } | ConvertTo-Json -Depth 5 -Compress

        Invoke-RestMethod `
            -Uri     "https://www.zohoapis.com/books/v3/customerpayments?organization_id=$orgId" `
            -Headers $Headers -Method POST -Body $pmtBody -TimeoutSec 20 | Out-Null
        return $invoiceId
    } catch {
        $errMsg = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        Write-Host "    ⚠️ خطأ فاتورة: $($errMsg.message ?? $_.Exception.Message)"
    }
    return $null
}

# ── إنشاء قيد يومي (Journal Entry) ─────────────────────────────
function New-ZohoJournalEntry {
    param(
        [string]$Date,
        [decimal]$Amount,
        [string]$DebitAccountId,
        [string]$CreditAccountId,
        [string]$Notes,
        $Headers
    )
    $orgId = Get-OrgId
    $body  = @{
        journal_date  = $Date
        entry_number  = ""
        notes         = $Notes
        line_items    = @(
            @{ account_id = $DebitAccountId;  debit_or_credit = "debit";  amount = $Amount }
            @{ account_id = $CreditAccountId; debit_or_credit = "credit"; amount = $Amount }
        )
    } | ConvertTo-Json -Depth 5 -Compress

    try {
        $r = Invoke-RestMethod `
            -Uri     "https://www.zohoapis.com/books/v3/journals?organization_id=$orgId" `
            -Headers $Headers -Method POST -Body $body -TimeoutSec 20
        if ($r.journal) { return $r.journal.journal_id }
    } catch {
        $errMsg = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        Write-Host "    ⚠️ خطأ قيد: $($errMsg.message ?? $_.Exception.Message)"
    }
    return $null
}

# ── جلب رصيد الـ Cash Account من Zoho ──────────────────────────
function Get-ZohoCashBalance {
    param($Headers)
    $orgId = Get-OrgId
    try {
        $r = Invoke-RestMethod `
            -Uri     "https://www.zohoapis.com/books/v3/chartofaccounts/628287000000000388?organization_id=$orgId" `
            -Headers $Headers -Method GET -TimeoutSec 15
        return $r.account.current_balance
    } catch {
        return $null
    }
}
