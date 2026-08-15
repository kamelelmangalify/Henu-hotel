#Requires -Version 7
# add_transaction.ps1 — تسجيل معاملة جديدة

param(
    [string]$Date          = "",
    [string]$Type          = "مصروف",
    [double]$Amount        = 0,
    [string]$Description   = "",
    [string]$Category      = "نثريات",
    [string]$Reference     = "-",
    [string]$PaymentMethod = "نقدي",
    [string]$EnteredBy     = "النظام",
    [string]$Notes         = "",
    [string]$LedgerPath    = "D:\Henu\accountant\memory\ledger.json"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
if (-not $Date) { $Date = Get-Date -Format "yyyy-MM-dd" }

$raw    = [System.IO.File]::ReadAllText($LedgerPath, [System.Text.Encoding]::UTF8)
$ledger = $raw | ConvertFrom-Json

# توليد ID فريد
$ts   = Get-Date -Format "yyyyMMddHHmmss"
$hash = [System.Math]::Abs(($Date + $Type + $Amount.ToString() + $Description).GetHashCode()).ToString()
$txId = "TX-$ts-$hash"

# فحص التكرار
foreach ($tx in $ledger.transactions) {
    if ($tx.date -eq $Date -and $tx.type -eq $Type -and
        $tx.description -eq $Description -and
        [math]::Abs([double]$tx.amount - $Amount) -lt 0.01) {
        Write-Host "⚠️  تكرار! المعاملة موجودة: $($tx.id)"
        Write-Host "DUPLICATE:$($tx.id)"
        exit 2
    }
}

# التحقق
$warnings = [System.Collections.Generic.List[string]]::new()
if ($Amount -le 0)        { $warnings.Add("المبلغ يجب أن يكون أكبر من صفر") }
if ($Description -eq "")  { $warnings.Add("البيان فارغ") }
if ($Amount -gt 5000 -and $PaymentMethod -eq "نقدي") {
    $warnings.Add("مبلغ نقدي كبير — يستوجب مراجعة")
}

# بناء المعاملة
$newTx = [PSCustomObject]@{
    id             = $txId
    date           = $Date
    type           = $Type
    amount         = $Amount
    description    = $Description
    category       = $Category
    reference      = $Reference
    payment_method = $PaymentMethod
    entered_by     = $EnteredBy
    entered_at     = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    notes          = $Notes
    warnings       = ($warnings -join " | ")
    reviewed       = $false
    review_status  = if ($warnings.Count -gt 0) { "يستوجب مراجعة" } else { "موافق" }
    zoho_id        = ""
}

# الإضافة والحفظ
$txList = [System.Collections.Generic.List[object]]::new()
foreach ($t in $ledger.transactions) { $txList.Add($t) }
$txList.Add($newTx)
$ledger.transactions       = $txList.ToArray()
$ledger.meta.total_entries = $ledger.transactions.Count
$ledger.meta.last_updated  = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")

$json = $ledger | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($LedgerPath, $json, [System.Text.UTF8Encoding]::new($false))

Write-Host "✅ تم تسجيل المعاملة بنجاح"
Write-Host "ID: $txId"
Write-Host "التاريخ: $Date | النوع: $Type | المبلغ: $Amount ج | البيان: $Description"
if ($warnings.Count -gt 0) { Write-Host "⚠️  تحذيرات: $($warnings -join ' | ')" }
Write-Host "SUCCESS:$txId"