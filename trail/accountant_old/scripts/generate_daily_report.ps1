#Requires -Version 7
# generate_daily_report.ps1 — تقرير يومي شامل
# الاستخدام: pwsh -File generate_daily_report.ps1 [-Date yyyy-MM-dd]

param(
    [string]$Date       = "",
    [string]$LedgerPath = "D:\Henu\accountant\memory\ledger.json",
    [string]$ReportDir  = "D:\Henu\accountant\reports"
)

# يجب وضع هذا بعد param()
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
if (-not $Date) { $Date = Get-Date -Format "yyyy-MM-dd" }

$raw    = [System.IO.File]::ReadAllText($LedgerPath, [System.Text.Encoding]::UTF8)
$ledger = $raw | ConvertFrom-Json
$allTx  = @($ledger.transactions)
$today  = @($allTx | Where-Object { $_.date -eq $Date })

# حسابات اليوم
$income   = [double]((@($today | Where-Object { $_.type -eq "إيراد"         }) | Measure-Object amount -Sum).Sum)
$funding  = [double]((@($today | Where-Object { $_.type -eq "تمويل المالك"  }) | Measure-Object amount -Sum).Sum)
$expenses = [double]((@($today | Where-Object { $_.type -eq "مصروف"         }) | Measure-Object amount -Sum).Sum)
$net      = $income - $expenses
$needsReview = @($today | Where-Object { $_.review_status -eq "يستوجب مراجعة" })

# تجميع المصروفات حسب الفئة
$expGroups = @($today | Where-Object { $_.type -eq "مصروف" }) |
             Group-Object category |
             Sort-Object { ($_.Group | Measure-Object amount -Sum).Sum } -Descending

# بناء التقرير
$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add("# 📊 التقرير المحاسبي اليومي — هوستل الأهرامات")
$lines.Add("**التاريخ:** $Date | **وقت الإصدار:** $(Get-Date -Format 'HH:mm:ss') | **النظام:** المحاسب الذكي v2")
$lines.Add("")
$lines.Add("---")
$lines.Add("")
$lines.Add("## 🔢 ملخص اليوم")
$lines.Add("")
$lines.Add("| البيان | المبلغ (ج) |")
$lines.Add("|--------|-----------|")
$lines.Add("| 💰 إيرادات تشغيلية | $income |")
$lines.Add("| 🏦 تمويل المالك    | $funding |")
$lines.Add("| 💸 مصروفات          | $expenses |")
$lines.Add("| ✅ صافي التشغيل     | $net |")
$lines.Add("| 📋 عدد المعاملات    | $($today.Count) |")
$lines.Add("| ⚠️  للمراجعة         | $($needsReview.Count) |")
$lines.Add("")
if ($net -ge 0) {
    $lines.Add("> ✅ **يوم إيجابي — فائض $net ج**")
} else {
    $lines.Add("> ⚠️ **عجز تشغيلي $([math]::Abs($net)) ج — مُغطّى من تمويل المالك**")
}
$lines.Add("")
$lines.Add("---")
$lines.Add("")
$lines.Add("## 📋 تفاصيل المعاملات ($($today.Count) معاملة)")
$lines.Add("")
$lines.Add("| # | النوع | البيان | الفئة | المبلغ | الدفع | Zoho | الحالة |")
$lines.Add("|---|-------|--------|-------|--------|-------|------|--------|")

$i = 1
foreach ($tx in ($today | Sort-Object type)) {
    $icon   = switch ($tx.type) {
        "إيراد"        { "🟢" }
        "مصروف"        { "🔴" }
        "تمويل المالك" { "🏦" }
        default        { "⬜" }
    }
    $zohoSt = if (-not [string]::IsNullOrEmpty($tx.zoho_id)) { "✅" } else { "⏳" }
    $rvwSt  = if ($tx.review_status -eq "يستوجب مراجعة") { "⚠️ مراجعة" } else { "✅ موافق" }
    $lines.Add("| $i | $icon $($tx.type) | $($tx.description) | $($tx.category) | $($tx.amount) ج | $($tx.payment_method) | $zohoSt | $rvwSt |")
    $i++
}

$lines.Add("")
$lines.Add("---")
$lines.Add("")

if ($expGroups.Count -gt 0) {
    $lines.Add("## 📁 المصروفات حسب الفئة")
    $lines.Add("")
    $lines.Add("| الفئة | عدد | الإجمالي (ج) | النسبة |")
    $lines.Add("|-------|-----|-------------|--------|")
    foreach ($g in $expGroups) {
        $gSum = [double]($g.Group | Measure-Object amount -Sum).Sum
        $pct  = if ($expenses -gt 0) { [math]::Round(($gSum / $expenses) * 100, 1) } else { 0 }
        $lines.Add("| $($g.Name) | $($g.Count) | $gSum | $pct% |")
    }
    $lines.Add("")
    $lines.Add("---")
    $lines.Add("")
}

if ($needsReview.Count -gt 0) {
    $lines.Add("## ⚠️ معاملات تستوجب المراجعة")
    $lines.Add("")
    foreach ($tx in $needsReview) {
        $lines.Add("- **$($tx.description)** ($($tx.amount) ج) — $($tx.warnings)")
    }
} else {
    $lines.Add("## ⚠️ معاملات تستوجب المراجعة")
    $lines.Add("")
    $lines.Add("> ✅ لا توجد معاملات تستوجب المراجعة")
}

$lines.Add("")
$lines.Add("---")
$lines.Add("")
$lines.Add("## 📈 إحصائيات الأرشيف")
$lines.Add("")
$lines.Add("| البيان | القيمة |")
$lines.Add("|--------|--------|")
$lines.Add("| إجمالي المعاملات | $($allTx.Count) |")
$lines.Add("| آخر تحديث | $($ledger.meta.last_updated) |")
$pendingZoho = @($allTx | Where-Object { [string]::IsNullOrEmpty($_.zoho_id) }).Count
$lines.Add("| معاملات لم تُرفع لـ Zoho | $pendingZoho |")
$lines.Add("")
$lines.Add("---")
$lines.Add("*تقرير آلي — نظام المحاسب الذكي v2 لهوستل الأهرامات*")

# حفظ التقرير
if (-not (Test-Path $ReportDir)) { New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null }
$reportFile = "$ReportDir\report_$Date.md"
[System.IO.File]::WriteAllLines($reportFile, $lines, [System.Text.Encoding]::UTF8)

Write-Host "✅ تم إنشاء التقرير: $reportFile"
Write-Host "============================================"
Write-Host "  التقرير اليومي — $Date"
Write-Host "  إيرادات : $income ج"
Write-Host "  تمويل   : $funding ج"
Write-Host "  مصروفات : $expenses ج"
Write-Host "  صافي    : $net ج"
Write-Host "  معاملات : $($today.Count)"
Write-Host "  للمراجعة: $($needsReview.Count)"
Write-Host "============================================"