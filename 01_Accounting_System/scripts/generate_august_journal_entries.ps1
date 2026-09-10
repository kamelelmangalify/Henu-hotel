# generate_august_journal_entries.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ledgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"
$ledger = Get-Content $ledgerPath -Raw | ConvertFrom-Json
$allTx  = @($ledger.transactions | Where-Object { $_.amount -gt 0 })
$augustTx = @($allTx | Where-Object { $_.date -match "2026-08|8/\d+/2026|^8/" -or -not $_.date })

# التجميعات
$ownerFunding = ($augustTx | Where-Object type -eq "تمويل المالك" | Measure-Object amount -Sum).Sum
$totalRevenues = ($augustTx | Where-Object type -eq "إيراد"       | Measure-Object amount -Sum).Sum
$totalExpenses = ($augustTx | Where-Object type -eq "مصروف"       | Measure-Object amount -Sum).Sum

# تفاصيل المصروفات حسب التصنيف
$expGroups = $augustTx | Where-Object type -eq "مصروف" | Group-Object category | Select-Object Name, @{N="Total";E={($_.Group | Measure-Object amount -Sum).Sum}}

# تفاصيل الإيرادات حسب التصنيف
$revGroups = $augustTx | Where-Object type -eq "إيراد" | Group-Object category | Select-Object Name, @{N="Total";E={($_.Group | Measure-Object amount -Sum).Sum}}

Write-Host "=========================================="
Write-Host "📊 ملخص أرقام شهر أغسطس 2026 للقيود:"
Write-Host "=========================================="
Write-Host "تمويلات المالك    : $("{0:N0}" -f $ownerFunding) ج.م"
Write-Host "إجمالي الإيرادات   : $("{0:N0}" -f $totalRevenues) ج.م"
Write-Host "إجمالي المصروفات  : $("{0:N0}" -f $totalExpenses) ج.م"
Write-Host "------------------------------------------"
Write-Host "تصنيفات المصروفات:"
foreach ($g in $expGroups) {
    Write-Host "  - $($g.Name): $("{0:N0}" -f $g.Total) ج.م"
}
Write-Host "------------------------------------------"
Write-Host "تصنيفات الإيرادات:"
foreach ($rg in $revGroups) {
    Write-Host "  - $($rg.Name): $("{0:N0}" -f $rg.Total) ج.م"
}
Write-Host "=========================================="
