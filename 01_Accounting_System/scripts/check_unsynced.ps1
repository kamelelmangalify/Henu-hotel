# check_unsynced.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ledgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"
$ledger = Get-Content $ledgerPath -Raw | ConvertFrom-Json
$all = @($ledger.transactions)

$synced   = @($all | Where-Object { $_.zoho_id -and $_.zoho_id.Length -gt 5 })
$unsynced = @($all | Where-Object { -not $_.zoho_id -or $_.zoho_id.Length -le 5 })

Write-Host "=========================================="
Write-Host "📊 حالة المزامنة في الـ Ledger المحافظ عليه:"
Write-Host "=========================================="
Write-Host "إجمالي قيود الـ Ledger      : $($all.Count)"
Write-Host "معاملات مرفوعة سابقاً لـ Zoho: $($synced.Count)"
Write-Host "معاملات جديدة بانتظار الرفع  : $($unsynced.Count)"
Write-Host "=========================================="
