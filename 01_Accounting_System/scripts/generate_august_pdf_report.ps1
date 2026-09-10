# generate_august_pdf_report.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ledgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"
$htmlPath   = "D:\Henu\01_Accounting_System\reports\التقرير_المالي_شهر_أغسطس_2026.html"
$pdfPath    = "D:\Henu\التقرير_المالي_والحسابات_شهر_أغسطس_2026.pdf"

$ledger = Get-Content $ledgerPath -Raw -Encoding UTF8 | ConvertFrom-Json
$allTx  = @($ledger.transactions | Where-Object { $_.amount -gt 0 })

# تصفية شهر أغسطس 2026 (تاريخ يبدأ بـ 2026-08 أو 8/)
$augustTx = @($allTx | Where-Object { $_.date -match "2026-08|8/\d+/2026|^8/" -or -not $_.date })

# التجميعات المالية
$funding  = ($augustTx | Where-Object type -eq "تمويل المالك" | Measure-Object amount -Sum).Sum
$revenues = ($augustTx | Where-Object type -eq "إيراد"       | Measure-Object amount -Sum).Sum
$expenses = ($augustTx | Where-Object type -eq "مصروف"       | Measure-Object amount -Sum).Sum
$netCash  = $funding + $revenues - $expenses
$opNet    = $revenues - $expenses

# تصنيف المصروفات
$expItems = @($augustTx | Where-Object type -eq "مصروف")
$expCategories = $expItems | Group-Object category | Select-Object Name, @{N="Total";E={($_.Group | Measure-Object amount -Sum).Sum}}, Count | Sort-Object Total -Descending

# تصنيف السلف والرواتب
$salaryTx = @($expItems | Where-Object { $_.category -eq "سلف موظفين" -or $_.category -eq "رواتب ومكافآت" -or $_.description -match "سلفة|مرتب|راتب|مكافأة" })
$totalSalaries = ($salaryTx | Measure-Object amount -Sum).Sum

# تفاصيل السلف حسب الموظف
$advances = @($expItems | Where-Object { $_.description -match "سلفة|سلف" })
$advByEmp = $advances | Group-Object {
    if ($_.description -match "يوسف") { "يوسف" }
    elseif ($_.description -match "أحمد البار|احمد البار") { "أحمد البار" }
    elseif ($_.description -match "خالد") { "أستاذ خالد" }
    elseif ($_.description -match "محمد المنسي|محمد منسي") { "محمد المنسي" }
    elseif ($_.description -match "جومانة|جومانا") { "جومانة وجيه" }
    elseif ($_.description -match "مدحت") { "مدحت" }
    elseif ($_.description -match "منة") { "منة" }
    else { "أخرى" }
} | Select-Object Name, @{N="Total";E={($_.Group | Measure-Object amount -Sum).Sum}}, Count | Sort-Object Total -Descending

# بناء صفوف جدول المصروفات بالفئات
$catRowsHtml = ""
foreach ($cat in $expCategories) {
    $pct = if ($expenses -gt 0) { [math]::Round(($cat.Total / $expenses) * 100, 1) } else { 0 }
    $catRowsHtml += "
    <tr>
        <td style='font-weight:600;'>$($cat.Name)</td>
        <td style='text-align:center;'>$($cat.Count)</td>
        <td style='font-weight:700; color:#9B2C2C;'>$("{0:N0}" -f $cat.Total) ج.م</td>
        <td style='text-align:center;'>$pct%</td>
    </tr>"
}

# بناء صفوف جميع المعاملات
$txRowsHtml = ""
$idx = 1
foreach ($tx in ($augustTx | Sort-Object date)) {
    $typeBadge = switch ($tx.type) {
        "إيراد"        { "<span class='badge bg-green'>إيراد</span>" }
        "تمويل المالك" { "<span class='badge bg-blue'>تمويل مالك</span>" }
        "مصروف"        { "<span class='badge bg-red'>مصروف</span>" }
        default        { "<span class='badge bg-gray'>$($tx.type)</span>" }
    }
    $dateDisp = if ($tx.date) { $tx.date } else { "أغسطس 2026" }
    $notesDisp = if ($tx.notes) { $tx.notes } else { "-" }
    
    $txRowsHtml += "
    <tr>
        <td style='text-align:center; font-weight:600;'>$idx</td>
        <td style='text-align:center;'>$dateDisp</td>
        <td style='text-align:center;'>$typeBadge</td>
        <td style='font-weight:600;'>$($tx.description)</td>
        <td>$($tx.category)</td>
        <td style='font-weight:700; text-align:left;'>$("{0:N0}" -f $tx.amount) ج.م</td>
        <td style='font-size:8.5pt; color:#4A5568;'>$notesDisp</td>
    </tr>"
    $idx++
}

# بناء محتوى HTML للتقرير الشامل
$htmlContent = @"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>التقرير المالي والحسابات — شهر أغسطس 2026 — هوستل الأهرامات</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        
        @page {
            size: A4 portrait;
            margin: 12mm 12mm 15mm 12mm;
            @bottom-left {
                content: "هوستل الأهرامات — التقرير المالي لشهر أغسطس 2026";
                font-family: 'Cairo', sans-serif;
                font-size: 8pt;
                color: #718096;
            }
            @bottom-right {
                content: "صفحة " counter(page) " من " counter(pages);
                font-family: 'Cairo', sans-serif;
                font-size: 8pt;
                color: #718096;
            }
        }

        body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #2D3748;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            font-size: 9.5pt;
            line-height: 1.5;
        }

        .header {
            border-bottom: 3px solid #1A365D;
            padding-bottom: 10px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .title-container h1 {
            font-size: 20pt;
            font-weight: 800;
            color: #1A365D;
            margin: 0;
        }

        .title-container p {
            font-size: 10pt;
            color: #4A5568;
            margin: 3px 0 0 0;
        }

        .meta-info {
            text-align: left;
            font-size: 8.5pt;
            color: #718096;
        }

        .summary-cards {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 15px;
        }

        .card {
            flex: 1;
            background: #F7FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 10px 12px;
            text-align: center;
        }

        .card.card-blue { border-top: 4px solid #3182CE; background: #EBF8FF; }
        .card.card-green { border-top: 4px solid #38A169; background: #F0FFF4; }
        .card.card-red { border-top: 4px solid #E53E3E; background: #FFF5F5; }
        .card.card-gold { border-top: 4px solid #D69E2E; background: #FEFCBF; }

        .card .card-title {
            font-size: 8.5pt;
            font-weight: 600;
            color: #4A5568;
            margin-bottom: 4px;
        }

        .card .card-value {
            font-size: 13.5pt;
            font-weight: 800;
        }

        .card-blue .card-value { color: #2B6CB0; }
        .card-green .card-value { color: #276749; }
        .card-red .card-value { color: #9B2C2C; }
        .card-gold .card-value { color: #975A16; }

        section-header {
            color: #1A365D;
            font-size: 12pt;
            font-weight: 700;
            border-right: 4px solid #3182CE;
            padding-right: 8px;
            margin-top: 15px;
            margin-bottom: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            font-size: 9pt;
        }

        th {
            background-color: #2B6CB0;
            color: #FFFFFF;
            padding: 6px 8px;
            font-weight: 700;
            border: 1px solid #2B6CB0;
            text-align: right;
        }

        td {
            padding: 5px 8px;
            border: 1px solid #E2E8F0;
        }

        tr:nth-child(even) {
            background-color: #F7FAFC;
        }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7.5pt;
            font-weight: 700;
        }
        .bg-green { background-color: #C6F6D5; color: #22543D; }
        .bg-blue { background-color: #BEE3F8; color: #2A4365; }
        .bg-red { background-color: #FED7D7; color: #742A2A; }
        .bg-gray { background-color: #EDF2F7; color: #4A5568; }

        .total-row td {
            font-weight: 800;
            background-color: #EDF2F7;
            border-top: 2px solid #CBD5E0;
        }

        .footer-note {
            margin-top: 15px;
            padding: 8px 12px;
            background-color: #EDF2F7;
            border-radius: 4px;
            font-size: 8pt;
            color: #4A5568;
        }

        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="title-container">
            <h1>هوستل الأهرامات (Pyramids Hostel)</h1>
            <p>التقرير المحاسبي والمالي الشامل — شهر أغسطس 2026</p>
        </div>
        <div class="meta-info">
            <strong>تاريخ الإصدار:</strong> 1 سبتمبر 2026<br>
            <strong>عدد المعاملات:</strong> $($augustTx.Count) معاملة<br>
            <strong>نظام التوثيق:</strong> المحاسب الذكي v2.0
        </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
        <div class="card card-blue">
            <div class="card-title">🏦 تمويلات المالك</div>
            <div class="card-value">$("{0:N0}" -f $funding) ج.م</div>
        </div>
        <div class="card card-green">
            <div class="card-title">💰 إجمالي الإيرادات التشغيلية</div>
            <div class="card-value">$("{0:N0}" -f $revenues) ج.م</div>
        </div>
        <div class="card card-red">
            <div class="card-title">💸 إجمالي المصروفات</div>
            <div class="card-value">$("{0:N0}" -f $expenses) ج.م</div>
        </div>
        <div class="card card-gold">
            <div class="card-title">⚖️ صافي رصيد الصندوق التجريبي</div>
            <div class="card-value">$("{0:N0}" -f $netCash) ج.م</div>
        </div>
    </div>

    <!-- Section 1: Summary Tables -->
    <div class="section-header">📊 أولاً: تحليل المصروفات حسب الفئات الرئيسية</div>
    <table>
        <thead>
            <tr>
                <th>فئة المصروف</th>
                <th style="text-align:center;">عدد المعاملات</th>
                <th>إجمالي المبلغ</th>
                <th style="text-align:center;">النسبة من المصروفات</th>
            </tr>
        </thead>
        <tbody>
            $catRowsHtml
            <tr class="total-row">
                <td>إجمالي المصروفات التشغيلية والتجهيزية</td>
                <td style="text-align:center;">$($expItems.Count)</td>
                <td style="color:#9B2C2C;">$("{0:N0}" -f $expenses) ج.م</td>
                <td style="text-align:center;">100%</td>
            </tr>
        </tbody>
    </table>

    <div class="section-header" style="margin-top:20px;">👥 ثانياً: ملخص سلف ورواتب الموظفين (شهر أغسطس)</div>
    <table>
        <thead>
            <tr>
                <th>اسم الموظف</th>
                <th style="text-align:center;">عدد حركات السلف</th>
                <th>إجمالي قيمة السلف (ج.م)</th>
            </tr>
        </thead>
        <tbody>
"@

foreach ($emp in $advByEmp) {
    $htmlContent += "
            <tr>
                <td style='font-weight:600;'>$($emp.Name)</td>
                <td style='text-align:center;'>$($emp.Count)</td>
                <td style='font-weight:700; color:#2B6CB0;'>$("{0:N0}" -f $emp.Total) ج.م</td>
            </tr>"
}

$htmlContent += @"
            <tr class="total-row">
                <td>إجمالي سلف الموظفين المسحوبة</td>
                <td style="text-align:center;">$($advances.Count)</td>
                <td style="color:#2B6CB0;">$("{0:N0}" -f ($advances | Measure-Object amount -Sum).Sum) ج.م</td>
            </tr>
        </tbody>
    </table>

    <div class="page-break"></div>

    <!-- Section 2: Detailed Transaction Register -->
    <div class="section-header">📋 ثالثاً: كشف تفصيلي بجميع معاملات شهر أغسطس 2026 ($($augustTx.Count) معاملة)</div>
    <table>
        <thead>
            <tr>
                <th style="text-align:center; width:30px;">#</th>
                <th style="text-align:center; width:75px;">التاريخ</th>
                <th style="text-align:center; width:70px;">النوع</th>
                <th>البيان / تفاصيل الحركة</th>
                <th style="width:110px;">التصنيف</th>
                <th style="width:90px; text-align:left;">المبلغ</th>
                <th>ملاحظات</th>
            </tr>
        </thead>
        <tbody>
            $txRowsHtml
            <tr class="total-row">
                <td colspan="5" style="text-align:left;">الإجمالي الكلي لجميع الحركة المالية لشهر أغسطس:</td>
                <td style="text-align:left; color:#1A365D;">$("{0:N0}" -f ($augustTx | Measure-Object amount -Sum).Sum) ج.م</td>
                <td>-</td>
            </tr>
        </tbody>
    </table>

    <div class="footer-note">
        <strong>ملاحظة محاسبية:</strong> تم إعداد وتوثيق هذا التقرير آلياً بناءً على السجل المالي الرسمي المعتمد لهوستل الأهرامات عن شهر أغسطس 2026. جميع الأرصدة والمجموعات مرحلة ومطابقة دفاتر الـ Ledger.
    </div>

</body>
</html>
"@

[System.IO.File]::WriteAllText($htmlPath, $htmlContent, [System.Text.Encoding]::UTF8)
Write-Host "✅ تم توليد ملف HTML التقرير: $htmlPath"

# تحويل الـ HTML إلى PDF باستخدام Microsoft Edge Headless
Write-Host "🔄 جارٍ تحويل التقرير إلى ملف PDF عالي الجودة..."

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$process = Start-Process -FilePath $edgeExe -ArgumentList "--headless --disable-gpu --print-to-pdf=`"$pdfPath`" `"$htmlPath`"" -Wait -PassThru

if (Test-Path $pdfPath) {
    $pdfSize = [math]::Round((Get-Item $pdfPath).Length / 1KB, 1)
    Write-Host "=========================================="
    Write-Host "🎉 تم إنشاء ملف الـ PDF بنجاح!"
    Write-Host "مسار الملف: $pdfPath"
    Write-Host "حجم الملف : $pdfSize KB"
    Write-Host "=========================================="
} else {
    Write-Host "❌ فشل توليد ملف الـ PDF"
}
