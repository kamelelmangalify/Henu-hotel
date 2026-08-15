# ============================================================
# review_entries.ps1
# يراجع المعاملات ويعلّم المشبوهة ويقبل/يرفض بعد فحص
# ============================================================
param(
    [string]$Action      = "list",   # list / approve / reject / stats
    [string]$TxId        = "",
    [string]$ReviewedBy  = "المحاسب الأول",
    [string]$ReviewNote  = "",
    [string]$LedgerPath  = "D:\Henu\accountant\memory\ledger.json",
    [string]$DateFilter  = ""
)

$ledger = Get-Content $LedgerPath -Raw -Encoding UTF8 | ConvertFrom-Json

switch ($Action) {

    "list" {
        Write-Host "============================================"
        Write-Host "  المعاملات التي تستوجب المراجعة"
        Write-Host "============================================"
        $pending = $ledger.transactions | Where-Object {
            $_.reviewed -eq $false -and $_.review_status -eq "يستوجب مراجعة" -and
            ($DateFilter -eq "" -or $_.date -eq $DateFilter)
        }
        if ($pending.Count -eq 0) {
            Write-Host "✅ لا توجد معاملات معلقة للمراجعة"
        } else {
            $i = 1
            foreach ($tx in $pending) {
                Write-Host ""
                Write-Host "[$i] المعرف: $($tx.id)"
                Write-Host "    التاريخ: $($tx.date) | النوع: $($tx.type) | المبلغ: $($tx.amount) ج"
                Write-Host "    البيان: $($tx.description) | الفئة: $($tx.category)"
                Write-Host "    أدخله: $($tx.entered_by) | وسيلة الدفع: $($tx.payment_method)"
                Write-Host "    ⚠️  التحذير: $($tx.warnings)"
                $i++
            }
            Write-Host ""
            Write-Host "إجمالي المعلقة: $($pending.Count) معاملة"
        }
    }

    "approve" {
        if ($TxId -eq "") { Write-Host "❌ يجب تحديد رقم المعاملة (TxId)"; exit 1 }
        $tx = $ledger.transactions | Where-Object { $_.id -eq $TxId }
        if (-not $tx) { Write-Host "❌ المعاملة غير موجودة: $TxId"; exit 1 }
        $tx.reviewed      = $true
        $tx.review_status = "موافق — بعد مراجعة"
        $tx.notes         = $tx.notes + " | مراجعة: $ReviewedBy ($ReviewNote) $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        $ledger | ConvertTo-Json -Depth 10 | Out-File $LedgerPath -Encoding UTF8
        Write-Host "✅ تمت الموافقة على المعاملة: $TxId"
        Write-Host "   راجعها: $ReviewedBy | ملاحظة: $ReviewNote"
    }

    "reject" {
        if ($TxId -eq "") { Write-Host "❌ يجب تحديد رقم المعاملة (TxId)"; exit 1 }
        $tx = $ledger.transactions | Where-Object { $_.id -eq $TxId }
        if (-not $tx) { Write-Host "❌ المعاملة غير موجودة: $TxId"; exit 1 }
        $tx.reviewed      = $true
        $tx.review_status = "مرفوض"
        $tx.notes         = $tx.notes + " | رفض: $ReviewedBy ($ReviewNote) $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        $ledger | ConvertTo-Json -Depth 10 | Out-File $LedgerPath -Encoding UTF8
        Write-Host "🚫 تم رفض المعاملة: $TxId"
        Write-Host "   رفضها: $ReviewedBy | سبب: $ReviewNote"
    }

    "stats" {
        $total    = $ledger.transactions.Count
        $pending  = ($ledger.transactions | Where-Object { $_.reviewed -eq $false -and $_.review_status -eq "يستوجب مراجعة" }).Count
        $approved = ($ledger.transactions | Where-Object { $_.review_status -like "موافق*" }).Count
        $rejected = ($ledger.transactions | Where-Object { $_.review_status -eq "مرفوض" }).Count
        $totalIncome  = ($ledger.transactions | Where-Object { $_.type -eq "إيراد"  } | Measure-Object -Property amount -Sum).Sum
        $totalExpense = ($ledger.transactions | Where-Object { $_.type -eq "مصروف" } | Measure-Object -Property amount -Sum).Sum
        if (-not $totalIncome)  { $totalIncome  = 0 }
        if (-not $totalExpense) { $totalExpense = 0 }
        Write-Host "============================================"
        Write-Host "  إحصائيات الدفتر الكامل"
        Write-Host "============================================"
        Write-Host "  إجمالي المعاملات : $total"
        Write-Host "  معلقة للمراجعة  : $pending"
        Write-Host "  موافق عليها      : $approved"
        Write-Host "  مرفوضة           : $rejected"
        Write-Host "  إجمالي إيرادات   : $([math]::Round($totalIncome,2)) ج"
        Write-Host "  إجمالي مصروفات   : $([math]::Round($totalExpense,2)) ج"
        Write-Host "  صافي الرصيد      : $([math]::Round($totalIncome - $totalExpense,2)) ج"
        Write-Host "============================================"
    }
}
