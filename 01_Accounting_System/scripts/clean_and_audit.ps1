# ================================================================
# clean_and_audit.ps1
# ينظف المعاملات الفارغة في ledger.json ويتحقق من المطابقة التامة
# ================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$path = "D:\Henu\01_Accounting_System\memory\ledger.json"
$json = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json

$cleanTx = [System.Collections.Generic.List[PSObject]]::new()
$seen = @{}

foreach ($t in $json.transactions) {
    if ($t.amount -gt 0 -and $t.description) {
        # مفتاح منع التكرار
        $key = "$($t.date)|$($t.type)|$($t.amount)|$($t.description.Trim())"
        if (-not $seen.ContainsKey($key)) {
            $seen[$key] = $true
            $cleanTx.Add($t)
        } elseif ($t.zoho_id -and -not ( $cleanTx | Where-Object { "$($_.date)|$($_.type)|$($_.amount)|$($_.description.Trim())" -eq $key -and $_.zoho_id } )) {
            # تحديث القيد الموجود برقم zoho_id
            $existing = $cleanTx | Where-Object { "$($_.date)|$($_.type)|$($_.amount)|$($_.description.Trim())" -eq $key }
            if ($existing) {
                $existing.zoho_id = $t.zoho_id
                $existing.zoho_synced_at = $t.zoho_synced_at
            }
        }
    }
}

$json.transactions = $cleanTx
$json.meta.total_entries = $cleanTx.Count
$json.meta.last_updated = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
$json | ConvertTo-Json -Depth 10 | Out-File $path -Encoding UTF8

$funding = ($cleanTx | Where-Object type -eq "تمويل المالك" | Measure-Object amount -Sum).Sum
$rev     = ($cleanTx | Where-Object type -eq "إيراد" | Measure-Object amount -Sum).Sum
$exp     = ($cleanTx | Where-Object type -eq "مصروف" | Measure-Object amount -Sum).Sum
$bal     = $funding + $rev - $exp
$synced  = ($cleanTx | Where-Object { $_.zoho_id -and $_.zoho_id.Length -gt 5 }).Count

Write-Host "=========================================="
Write-Host "📊 التقرير النهائي للـ Ledger والحسابات:"
Write-Host "=========================================="
Write-Host "إجمالي عدد القيود الفعالة : $($cleanTx.Count)"
Write-Host "إجمالي تمويلات المالك    : $("{0:N0}" -f $funding) ج"
Write-Host "إجمالي الإيرادات         : $("{0:N0}" -f $rev) ج"
Write-Host "إجمالي المصروفات        : $("{0:N0}" -f $exp) ج"
Write-Host "------------------------------------------"
Write-Host "صافي رصيد الصندوق        : $("{0:N0}" -f $bal) ج"
Write-Host "المعاملات المرفوعة لـ Zoho : $synced من أصل $($cleanTx.Count)"
Write-Host "=========================================="
