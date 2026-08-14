#Requires -Version 7
# generate_payroll_report.ps1 — تقرير رواتب وسلف الموظفين وكشوف الشيفتات والمستحقات

param(
    [string]$Month       = "2026-08",
    [string]$LedgerPath  = "D:\Henu\accountant\memory\ledger.json",
    [string]$EmpPath     = "D:\Henu\accountant\memory\employees.json",
    [string]$ReportDir   = "D:\Henu\accountant\reports"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$employees = ([System.IO.File]::ReadAllText($EmpPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json).employees
$ledger    = ([System.IO.File]::ReadAllText($LedgerPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json)
$allTx     = @($ledger.transactions)

$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add("# 👥 كشف الرواتب والشيفتات والسلف الشامل — هوستل الأهرامات")
$lines.Add("**شهر الاستحقاق الحالي:** $Month | **تاريخ التقرير:** $(Get-Date -Format 'yyyy-MM-dd HH:mm') | **عدد الموظفين:** $($employees.Count)")
$lines.Add("")
$lines.Add("---")
$lines.Add("")

$totalPayrollBase = 0
$totalAdvancesAug = 0
$totalBonusesAug  = 0
$totalNetDueAug   = 0

$recRows = [System.Collections.Generic.List[string]]::new()
$hkRows  = [System.Collections.Generic.List[string]]::new()
$mgtRows = [System.Collections.Generic.List[string]]::new()

foreach ($emp in $employees) {
    $empName = $emp.name

    # مطابقة اسم الموظف بشرط ألا تكون معاملة مورد (مثل علاء الكهربائي)
    $empTxsAll = @($allTx | Where-Object { 
        ($_.description -match "\b$empName\b" -or $_.notes -match "\b$empName\b") -and
        $_.category -ne "موردون" -and $_.description -notmatch "علاء الكهربائي"
    })

    # 1. تسويات سابقة عن شهر 7
    $prevPaidTxs = @($empTxsAll | Where-Object { 
        $_.notes -match "شهر 7" -or $_.category -match "شهر 7"
    })
    $prevPaidSum = [double]((@($prevPaidTxs) | Measure-Object amount -Sum).Sum)

    # 2. حركات شهر 8 الحالية
    $currTxs = @($empTxsAll | Where-Object { 
        -not ($_.notes -match "شهر 7" -or $_.category -match "شهر 7")
    })

    $advancesAug   = [double]((@($currTxs | Where-Object { $_.description -match "سلفة|سلف" -or $_.category -eq "سلف موظفين" -or $_.category -eq "سلف شهر 8" }) | Measure-Object amount -Sum).Sum)
    $bonusesAug    = [double]((@($currTxs | Where-Object { $_.description -match "مكافأة|مكافاه" }) | Measure-Object amount -Sum).Sum)
    $paidAug       = [double]((@($currTxs | Where-Object { $_.description -match "راتب|مرتب" -and -not ($_.notes -match "شهر 7") }) | Measure-Object amount -Sum).Sum)
    $othersAug     = [double]((@($currTxs | Where-Object { $_.description -match "كارت شحن" }) | Measure-Object amount -Sum).Sum)

    $deductionsAug = $advancesAug + $othersAug
    $netDueAug     = $emp.base_salary + $bonusesAug - $deductionsAug - $paidAug

    $totalPayrollBase += $emp.base_salary
    $totalAdvancesAug += $advancesAug
    $totalBonusesAug  += $bonusesAug
    $totalNetDueAug   += $netDueAug

    $row = "| **$($emp.name)** | $($emp.shift) | $($emp.base_salary) ج | $advancesAug ج | $bonusesAug ج | $paidAug ج | **$netDueAug ج** | $prevPaidSum ج |"

    if ($emp.department -eq "Reception") {
        $recRows.Add($row)
    } elseif ($emp.department -eq "Housekeeping") {
        $hkRows.Add($row)
    } else {
        $mgtRows.Add($row)
    }
}

$lines.Add("## 🏢 1. قسم الاستقبال (Reception)")
$lines.Add("")
$lines.Add("| الموظف | مواعيد الشيفت | راتب شهر 8 الأساسي | سلف وخصومات | مكافآت | مسدد من الراتب | **صافي المتبقي** | تسويات مسددة عن شهر 7 |")
$lines.Add("|--------|---------------|--------------------|--------------|--------|----------------|-----------------|------------------------|")
foreach ($r in $recRows) { $lines.Add($r) }

$lines.Add("")
$lines.Add("## 🧹 2. قسم الإشراف الداخلي والنظافة (Housekeeping)")
$lines.Add("")
$lines.Add("| الموظف | مواعيد الشيفت | راتب شهر 8 الأساسي | سلف وخصومات | مكافآت | مسدد من الراتب | **صافي المتبقي** | تسويات مسددة عن شهر 7 |")
$lines.Add("|--------|---------------|--------------------|--------------|--------|----------------|-----------------|------------------------|")
foreach ($r in $hkRows) { $lines.Add($r) }

if ($mgtRows.Count -gt 0) {
    $lines.Add("")
    $lines.Add("## 💼 3. الإدارة والتطوير (Management)")
    $lines.Add("")
    $lines.Add("| الموظف | مواعيد الشيفت | راتب شهر 8 الأساسي | سلف وخصومات | مكافآت | مسدد من الراتب | **صافي المتبقي** | تسويات مسددة عن شهر 7 |")
    $lines.Add("|--------|---------------|--------------------|--------------|--------|----------------|-----------------|------------------------|")
    foreach ($r in $mgtRows) { $lines.Add($r) }
}

$lines.Add("")
$lines.Add("---")
$lines.Add("")
$lines.Add("## 📊 ملخص ميزانية الأجور الشهرية للفندق")
$lines.Add("")
$lines.Add("| البيان | المبلغ الإجمالي |")
$lines.Add("|--------|----------------|")
$lines.Add("| 💰 إجمالي مسيرات الرواتب الأساسية | **$totalPayrollBase جنيه** |")
$lines.Add("| 💸 إجمالي السلف والخصومات لشهر 8 | **$totalAdvancesAug جنيه** |")
$lines.Add("| 🎁 إجمالي المكافآت والإضافي لشهر 8 | **$totalBonusesAug جنيه** |")
$lines.Add("| 💵 **إجمالي صافي الرواتب المتبقية للتقاضي** | **$totalNetDueAug جنيه** |")
$lines.Add("")
$lines.Add("---")
$lines.Add("")

$lines.Add("## 📋 تفاصيل حركات الموظفين")
$lines.Add("")

foreach ($emp in $employees) {
    $empName = $emp.name
    $empTxs  = @($allTx | Where-Object { 
        ($_.description -match "\b$empName\b" -or $_.notes -match "\b$empName\b") -and
        $_.category -ne "موردون" -and $_.description -notmatch "علاء الكهربائي"
    } | Sort-Object date)

    $lines.Add("### 👤 $($emp.name) — $($emp.position) ($($emp.department))")
    $lines.Add("- **الشيفت**: $($emp.shift)")
    $lines.Add("- **الراتب الأساسي**: $($emp.base_salary) جنيه")
    $lines.Add("")
    if ($empTxs.Count -gt 0) {
        $lines.Add("| التاريخ | المعاملة / البيان | شهر الاستحقاق | المبلغ | طريقة الدفع |")
        $lines.Add("|---------|-------------------|---------------|--------|-------------|")
        foreach ($tx in $empTxs) {
            $period = if ($tx.notes -match "شهر 7" -or $tx.category -match "شهر 7") { "شهر 7/2026 (مستحق سابق)" } else { "شهر 8/2026 (الحالي)" }
            $lines.Add("| $($tx.date) | $($tx.description) | $period | $($tx.amount) ج | $($tx.payment_method) |")
        }
    } else {
        $lines.Add("> *لا توجد سلف أو مكافآت أو مسدادات مسجلة لهذا الموظف حتى الآن.*")
    }
    $lines.Add("")
}

$lines.Add("---")
$lines.Add("*تقرير آلي شامل لكادر الموظفين والشيفتات — نظام المحاسب الذكي لهوستل الأهرامات*")

if (-not (Test-Path $ReportDir)) { New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null }
$reportFile = "$ReportDir\payroll_report_$Month.md"
[System.IO.File]::WriteAllLines($reportFile, $lines, [System.Text.Encoding]::UTF8)

Write-Host "✅ تم تحديث كشف الرواتب الشامل بنجاح: $reportFile"
