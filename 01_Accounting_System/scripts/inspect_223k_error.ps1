# inspect_223k_error.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ledgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"
$ledger = Get-Content $ledgerPath -Raw | ConvertFrom-Json
$allTx  = @($ledger.transactions)

Write-Host "=== البحث عن المعاملات بقيمة 223,000 أو تصنيف إيراد غرف ==="

$tx223k = $allTx | Where-Object { $_.amount -eq 223000 -or $_.description -match "223000|223,000|223" -or $_.category -eq "إيراد غرف" }

foreach ($tx in $tx223k) {
    Write-Host "ID: $($tx.id) | Date: $($tx.date) | Type: $($tx.type) | Amt: $($tx.amount) | Category: '$($tx.category)' | Desc: '$($tx.description)' | Notes: '$($tx.notes)'"
}
