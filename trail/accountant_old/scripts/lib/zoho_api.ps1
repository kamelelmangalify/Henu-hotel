# =============================================================
# lib/zoho_api.ps1  —  دوال مشتركة للتعامل مع Zoho Books API
# يُستدعى بـ:  . "$PSScriptRoot\lib\zoho_api.ps1"
# =============================================================
Set-StrictMode -Off
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ZOHO_BASE    = "https://www.zohoapis.com/books/v3"
$ZOHO_CONFIG  = "D:\Henu\accountant\memory\zoho_config.json"
$LEDGER_PATH  = "D:\Henu\accountant\memory\ledger.json"

# ── تحميل الـ Config وتجديد التوكن إن لزم ──────────────────
function Get-ZohoToken {
    $cfg = [System.IO.File]::ReadAllText($ZOHO_CONFIG, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
    $expiry = [datetime]::Parse($cfg.token_expiry)
    if ((Get-Date) -lt $expiry.AddMinutes(-5)) { return $cfg }

    Write-Host "🔄 تجديد التوكن..."
    $body  = "refresh_token=$($cfg.refresh_token)&client_id=$($cfg.client_id)&client_secret=$($cfg.client_secret)&grant_type=refresh_token"
    $resp  = Invoke-RestMethod -Uri "https://accounts.zoho.com/oauth/v2/token" `
                               -Method POST -Body $body `
                               -ContentType "application/x-www-form-urlencoded"
    $cfg.access_token = $resp.access_token
    $cfg.token_expiry = (Get-Date).AddSeconds(3600).ToString("yyyy-MM-dd HH:mm:ss")
    $json = $cfg | ConvertTo-Json -Depth 5
    [System.IO.File]::WriteAllText($ZOHO_CONFIG, $json, [System.Text.Encoding]::UTF8)
    Write-Host "✅ تم تجديد التوكن"
    return $cfg
}

# ── بناء Headers ────────────────────────────────────────────
function Get-ZohoHeaders {
    $cfg = Get-ZohoToken
    $script:ZOHO_ORG_ID = $cfg.organization_id
    return @{
        Authorization  = "Zoho-oauthtoken $($cfg.access_token)"
        "Content-Type" = "application/json"
    }
}

# ── POST طلب لـ Zoho مع معالجة الأخطاء ─────────────────────
function Invoke-ZohoPost {
    param(
        [string]$Endpoint,
        [hashtable]$Body,
        [hashtable]$Headers
    )
    $url     = "$ZOHO_BASE/$Endpoint`?organization_id=$script:ZOHO_ORG_ID"
    $bodyStr = $Body | ConvertTo-Json -Depth 10
    $bytes   = [System.Text.Encoding]::UTF8.GetBytes($bodyStr)
    try {
        $resp = Invoke-RestMethod -Uri $url -Method POST -Headers $Headers -Body $bytes `
                                  -ContentType "application/json; charset=utf-8"
        return $resp
    } catch {
        $msg = $_.Exception.Message
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $msg    = $reader.ReadToEnd()
        } catch {}
        Write-Host "  ❌ Zoho Error: $msg"
        return $null
    }
}

# ── GET طلب لـ Zoho ──────────────────────────────────────────
function Invoke-ZohoGet {
    param([string]$Endpoint, [hashtable]$Headers, [string]$Query = "")
    $url = "$ZOHO_BASE/$Endpoint`?organization_id=$script:ZOHO_ORG_ID$Query"
    return Invoke-RestMethod -Uri $url -Method GET -Headers $Headers
}

# ── تحميل / حفظ الـ Ledger ──────────────────────────────────
function Get-Ledger {
    $raw = [System.IO.File]::ReadAllText($LEDGER_PATH, [System.Text.Encoding]::UTF8)
    return $raw | ConvertFrom-Json
}

function Save-Ledger {
    param($Ledger)
    $Ledger.meta.last_updated = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    $json = $Ledger | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($LEDGER_PATH, $json, [System.Text.Encoding]::UTF8)
}

# ── إنشاء / البحث عن جهة اتصال ──────────────────────────────
function Get-OrCreateContact {
    param([string]$Name, [string]$Type, [hashtable]$Headers)
    $enc  = [uri]::EscapeDataString($Name)
    $r    = Invoke-ZohoGet -Endpoint "contacts" -Headers $Headers -Query "&contact_name=$enc&contact_type=$Type"
    if ($r.contacts.Count -gt 0) { return $r.contacts[0].contact_id }

    $resp = Invoke-ZohoPost -Endpoint "contacts" -Headers $Headers `
                            -Body @{ contact_name = $Name; contact_type = $Type }
    if ($resp -and $resp.code -eq 0) {
        Write-Host "  👤 تم إنشاء جهة اتصال: $Name → $($resp.contact.contact_id)"
        return $resp.contact.contact_id
    }
    return $null
}

# ── إنشاء Expense ────────────────────────────────────────────
function New-ZohoExpense {
    param(
        [string]$Date,
        [double]$Amount,
        [string]$AccountId,
        [string]$Description,
        [string]$PaymentMode = "Cash",
        [string]$VendorId    = "",
        [hashtable]$Headers
    )
    $body = @{
        date         = $Date
        amount       = $Amount
        account_id   = $AccountId
        description  = $Description
        payment_mode = $PaymentMode
    }
    if ($VendorId) { $body.vendor_id = $VendorId }
    $resp = Invoke-ZohoPost -Endpoint "expenses" -Headers $Headers -Body $body
    if ($resp -and $resp.code -eq 0) { return $resp.expense.expense_id }
    return $null
}

# ── إنشاء Invoice + تسجيل دفع ───────────────────────────────
function New-ZohoInvoiceWithPayment {
    param(
        [string]$CustomerId,
        [string]$Date,
        [double]$Amount,
        [string]$Description,
        [string]$PaymentMode = "BankTransfer",
        [hashtable]$Headers
    )
    $invResp = Invoke-ZohoPost -Endpoint "invoices" -Headers $Headers -Body @{
        customer_id   = $CustomerId
        date          = $Date
        payment_terms = 0
        line_items    = @(@{ name = $Description; rate = $Amount; quantity = 1 })
    }
    if (-not $invResp -or $invResp.code -ne 0) { return $null }
    $invId = $invResp.invoice.invoice_id
    Start-Sleep -Milliseconds 400

    $pmtResp = Invoke-ZohoPost -Endpoint "customerpayments" -Headers $Headers -Body @{
        payment_mode = $PaymentMode
        amount       = $Amount
        date         = $Date
        invoices     = @(@{ invoice_id = $invId; amount_applied = $Amount })
    }
    if ($pmtResp -and $pmtResp.code -eq 0) {
        Write-Host "    💰 دفع مسجّل → $($pmtResp.payment.payment_id)"
    }
    return $invId
}

# ── إنشاء Journal Entry ──────────────────────────────────────
function New-ZohoJournalEntry {
    param(
        [string]$Date,
        [double]$Amount,
        [string]$DebitAccountId,
        [string]$CreditAccountId,
        [string]$Notes,
        [hashtable]$Headers
    )
    $resp = Invoke-ZohoPost -Endpoint "journalentries" -Headers $Headers -Body @{
        date             = $Date
        journal_date     = $Date
        notes            = $Notes
        line_items       = @(
            @{ account_id = $DebitAccountId;  debit_or_credit = "debit";  amount = $Amount },
            @{ account_id = $CreditAccountId; debit_or_credit = "credit"; amount = $Amount }
        )
    }
    if ($resp -and $resp.code -eq 0) { return $resp.journal.journal_id }
    return $null
}
