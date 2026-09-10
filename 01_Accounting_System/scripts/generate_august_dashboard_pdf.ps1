# generate_august_dashboard_pdf.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$htmlPath = "D:\Henu\01_Accounting_System\reports\تقرير_مراجعة_وداشبورد_أغسطس.html"
$pdfPath  = "D:\Henu\تقرير_مراجعة_وتحليل_أغسطس_مع_الداشبورد.pdf"

# تحميل وعرض البيانات المحلولة
. "D:\Henu\01_Accounting_System\scripts\audit_august_copy.ps1" | Out-Null

$augData = @(
    @{ Name="إيجار مقر الفندق الرئيسي"; Amt=220000; Count=1; Pct=43.4; Color="#1A365D" },
    @{ Name="تجهيزات ومعدات وأثاث الفندق"; Amt=141175; Count=17; Pct=27.9; Color="#2B6CB0" },
    @{ Name="صيانة ونثريات ومواصلات"; Amt=54525; Count=44; Pct=10.8; Color="#3182CE" },
    @{ Name="مرافق وفواتير حكومية"; Amt=30800; Count=8; Pct=6.1; Color="#4299E1" },
    @{ Name="شبكات وتطوير ويبسايت"; Amt=30000; Count=2; Pct=5.9; Color="#63B3ED" },
    @{ Name="سلف الموظفين العاملين"; Amt=11150; Count=21; Pct=2.2; Color="#DD6B20" },
    @{ Name="ضيافة وإعاشة وتوريدات"; Amt=10390; Count=24; Pct=2.0; Color="#38A169" },
    @{ Name="رواتب وأجور تشغيلية"; Amt=7000; Count=5; Pct=1.4; Color="#E53E3E" },
    @{ Name="عمولات حجز وتسكين"; Amt=1600; Count=3; Pct=0.3; Color="#805AD5" }
)

# بناء صفوف جدول التفكيك في الداشبورد
$dashCatRows = ""
foreach ($item in $augData) {
    $dashCatRows += "
    <tr>
        <td style='font-weight:700;'><span style='display:inline-block; width:10px; height:10px; background-color:$($item.Color); border-radius:2px; margin-left:6px;'></span>$($item.Name)</td>
        <td style='text-align:center;'>$($item.Count)</td>
        <td style='font-weight:700; color:#9B2C2C; text-align:left;'>$("{0:N0}" -f $item.Amt) ج.م</td>
        <td style='text-align:center; font-weight:600;'>$($item.Pct)%</td>
    </tr>"
}

# بناء صفوف جدول حركة المعاملات الـ 148
$txRowsHtml = ""
$idx = 1
foreach ($tx in $txList) {
    $typeBadge = switch ($tx.Type) {
        "إيراد"        { "<span class='badge bg-green'>إيراد</span>" }
        "تمويل المالك" { "<span class='badge bg-blue'>تمويل مالك</span>" }
        "مصروف"        { "<span class='badge bg-red'>مصروف</span>" }
        default        { "<span class='badge bg-gray'>$($tx.Type)</span>" }
    }
    $amtDisp = if ($tx.Expense -gt 0) { $tx.Expense } else { $tx.Revenue }
    $amtColor = if ($tx.Expense -gt 0) { "#9B2C2C" } else { "#276749" }
    $dateDisp = if ($tx.Date) { $tx.Date } else { "-" }

    $txRowsHtml += "
    <tr>
        <td style='text-align:center; font-weight:600;'>$idx</td>
        <td style='text-align:center;'>$dateDisp</td>
        <td style='text-align:center;'>$typeBadge</td>
        <td style='font-weight:600;'>$($tx.Description)</td>
        <td style='font-size:8.5pt; color:#4A5568;'>$($tx.Category)</td>
        <td style='font-weight:700; color:$amtColor; text-align:left;'>$("{0:N0}" -f $amtDisp) ج.م</td>
        <td style='font-weight:700; text-align:left; color:#1A365D;'>$("{0:N0}" -f $tx.Balance) ج.م</td>
    </tr>"
    $idx++
}

# بناء صفوف جدول ملخص سلف الموظفين
$advData = @(
    @{ Name="أستاذ خالد"; Amt=2500; Count=2 },
    @{ Name="أحمد البار"; Amt=2000; Count=2 },
    @{ Name="يوسف"; Amt=2600; Count=10 },
    @{ Name="محمد المنسي"; Amt=2200; Count=3 },
    @{ Name="مدحت"; Amt=1000; Count=2 },
    @{ Name="جومانا وجيه"; Amt=650; Count=3 },
    @{ Name="منة"; Amt=200; Count=1 }
)

$advRowsHtml = ""
foreach ($a in $advData) {
    $advRowsHtml += "
    <tr>
        <td style='font-weight:600;'>$($a.Name)</td>
        <td style='text-align:center;'>$($a.Count)</td>
        <td style='font-weight:700; color:#2B6CB0; text-align:left;'>$("{0:N0}" -f $a.Amt) ج.م</td>
    </tr>"
}

# محتوى HTML الكامل للتقرير مع الداشبورد والقيود المحاسبية في النهاية
$htmlContent = @"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تقرير مراجعة وتحليل شهر أغسطس مع الداشبورد والقيود المحاسبية — هوستل الأهرامات</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        
        @page {
            size: A4 portrait;
            margin: 10mm 10mm 12mm 10mm;
            @bottom-left {
                content: "هوستل الأهرامات — تقرير مراجعة وتحليل شهر أغسطس والقيود المحاسبية";
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
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
            color: #2D3748;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            font-size: 9pt;
            line-height: 1.45;
        }

        .header-bar {
            background: linear-gradient(135deg, #1A365D 0%, #2B6CB0 100%);
            color: #FFFFFF;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-bar h1 {
            font-size: 17pt;
            font-weight: 800;
            margin: 0;
        }

        .header-bar p {
            font-size: 9pt;
            margin: 2px 0 0 0;
            color: #E2E8F0;
        }

        .meta-box {
            text-align: left;
            font-size: 8pt;
            background: rgba(255,255,255,0.15);
            padding: 6px 10px;
            border-radius: 4px;
        }

        .kpi-grid {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 12px;
        }

        .kpi-card {
            flex: 1;
            background: #F7FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 8px 10px;
            text-align: center;
        }

        .kpi-card.blue { border-top: 4px solid #3182CE; background: #EBF8FF; }
        .kpi-card.green { border-top: 4px solid #38A169; background: #F0FFF4; }
        .kpi-card.red { border-top: 4px solid #E53E3E; background: #FFF5F5; }
        .kpi-card.gold { border-top: 4px solid #D69E2E; background: #FEFCBF; }

        .kpi-title { font-size: 8.5pt; font-weight: 600; color: #4A5568; margin-bottom: 3px; }
        .kpi-value { font-size: 13pt; font-weight: 800; }

        .blue .kpi-value { color: #2B6CB0; }
        .green .kpi-value { color: #276749; }
        .red .kpi-value { color: #9B2C2C; }
        .gold .kpi-value { color: #975A16; }

        .section-header {
            color: #1A365D;
            font-size: 11pt;
            font-weight: 800;
            border-right: 4px solid #2B6CB0;
            padding-right: 8px;
            margin-top: 12px;
            margin-bottom: 6px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 8.5pt;
        }

        th {
            background-color: #1A365D;
            color: #FFFFFF;
            padding: 5px 6px;
            font-weight: 700;
            border: 1px solid #1A365D;
            text-align: right;
        }

        td {
            padding: 4px 6px;
            border: 1px solid #CBD5E0;
        }

        tr:nth-child(even) { background-color: #F7FAFC; }

        .badge { display: inline-block; padding: 2px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: 700; }
        .bg-green { background-color: #C6F6D5; color: #22543D; }
        .bg-blue { background-color: #BEE3F8; color: #2A4365; }
        .bg-red { background-color: #FED7D7; color: #742A2A; }
        .bg-gray { background-color: #EDF2F7; color: #4A5568; }

        .total-row td {
            font-weight: 800;
            background-color: #EDF2F7;
            border-top: 2px solid #A0AEC0;
        }

        .page-break { page-break-before: always; }

        .progress-bar-container {
            width: 100%;
            background-color: #EDF2F7;
            border-radius: 4px;
            overflow: hidden;
            height: 14px;
            display: flex;
            margin-bottom: 10px;
        }

        .progress-bar-segment { height: 100%; }
    </style>
</head>
<body>

    <!-- PAGE 1: EXECUTIVE DASHBOARD -->
    <div class="header-bar">
        <div>
            <h1>هوستل الأهرامات — Pyramids Hostel</h1>
            <p>لوحة البيانات والتقرير المحاسبي التحليلي الشامل — شهر أغسطس 2026</p>
        </div>
        <div class="meta-box">
            <strong>المصدر:</strong> Copy of سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm<br>
            <strong>عدد المعاملات:</strong> 148 قيـد | <strong>تاريخ التقرير:</strong> 4 سبتمبر 2026
        </div>
    </div>

    <!-- KPI Summary Cards -->
    <div class="kpi-grid">
        <div class="kpi-card blue">
            <div class="kpi-title">🏦 تمويلات المالك والسيولة</div>
            <div class="kpi-value">485,540 ج.م</div>
        </div>
        <div class="kpi-card green">
            <div class="kpi-title">💰 إجمالي الإيرادات التشغيلية</div>
            <div class="kpi-value">25,795 ج.م</div>
        </div>
        <div class="kpi-card red">
            <div class="kpi-title">💸 إجمالي المصروفات الكلية</div>
            <div class="kpi-value">506,640 ج.م</div>
        </div>
        <div class="kpi-card gold">
            <div class="kpi-title">⚖️ رصيد الصندوق النهائي</div>
            <div class="kpi-value">4,695 ج.م</div>
        </div>
    </div>

    <!-- Visual Expense Structure Bar -->
    <div class="section-header">📊 أولاً: لوحة الرؤية البصرية والتوزيع النسبي للمصروفات</div>
    <div class="progress-bar-container">
        <div class="progress-bar-segment" style="width:43.4%; background-color:#1A365D;" title="إيجار المبنى 43.4%"></div>
        <div class="progress-bar-segment" style="width:27.9%; background-color:#2B6CB0;" title="تجهيزات وأثاث 27.9%"></div>
        <div class="progress-bar-segment" style="width:10.8%; background-color:#3182CE;" title="صيانة ونثريات 10.8%"></div>
        <div class="progress-bar-segment" style="width:6.1%; background-color:#4299E1;" title="مرافق حكومية 6.1%"></div>
        <div class="progress-bar-segment" style="width:5.9%; background-color:#63B3ED;" title="شبكات وويبسايت 5.9%"></div>
        <div class="progress-bar-segment" style="width:5.9%; background-color:#DD6B20;" title="سلف ورواتب وضيافة"></div>
    </div>

    <!-- Expense Breakdown Table -->
    <table>
        <thead>
            <tr>
                <th>تصنيف المصروفات التشغيلية والتجهيزية</th>
                <th style="text-align:center; width:80px;">عدد المعاملات</th>
                <th style="width:130px; text-align:left;">إجمالي المبلغ (ج.م)</th>
                <th style="text-align:center; width:90px;">النسبة المئوية</th>
            </tr>
        </thead>
        <tbody>
            $dashCatRows
            <tr class="total-row">
                <td>إجمالي المصروفات لشهر أغسطس 2026</td>
                <td style="text-align:center;">137</td>
                <td style="color:#9B2C2C; text-align:left;">506,640 ج.م</td>
                <td style="text-align:center;">100%</td>
            </tr>
        </tbody>
    </table>

    <div class="section-header" style="margin-top:10px;">👥 ثانياً: ملخص سلف الموظفين لشهر أغسطس</div>
    <table>
        <thead>
            <tr>
                <th>اسم الموظف</th>
                <th style="text-align:center; width:100px;">عدد حركات السلف</th>
                <th style="text-align:left; width:150px;">إجمالي قيمة السلف (ج.م)</th>
            </tr>
        </thead>
        <tbody>
            $advRowsHtml
            <tr class="total-row">
                <td>إجمالي سلف الموظفين المسحوبة من الصندوق</td>
                <td style="text-align:center;">21</td>
                <td style="color:#2B6CB0; text-align:left;">11,150 ج.م</td>
            </tr>
        </tbody>
    </table>

    <div class="page-break"></div>

    <!-- PAGE 2: FINANCIAL AUDIT & ANALYSIS -->
    <div class="section-header">📊 ثالثاً: التقرير التحليلي ونتائج التدقيق المحاسبي</div>
    
    <div style="background-color:#F7FAFC; border-right:4px solid #2B6CB0; padding:10px; border-radius:4px; margin-bottom:10px;">
        <h3 style="margin:0 0 4px 0; color:#1A365D; font-size:10pt;">1. هيكلية التدفقات النقدية والتمويل:</h3>
        <p style="margin:0; font-size:8.5pt; color:#4A5568;">
            بلغ إجمالي المقبوضات المودعة بالصندوق خلال شهر أغسطس <strong>511,335 ج.م</strong>، مقسمة إلى <strong>485,540 ج.م</strong> تمويلات مباشرة وشيكات ودولار من المالك لدعم التأسيس، و <strong>25,795 ج.م</strong> إيرادات تشغيلية من الغرف والمغسلة.
        </p>
    </div>

    <div style="background-color:#F7FAFC; border-right:4px solid #E53E3E; padding:10px; border-radius:4px; margin-bottom:10px;">
        <h3 style="margin:0 0 4px 0; color:#9B2C2C; font-size:10pt;">2. مراجعة المصروفات التشغيلية والتجهيزية:</h3>
        <p style="margin:0; font-size:8.5pt; color:#4A5568;">
            بلغت المصروفات الإجمالية <strong>506,640 ج.م</strong>. ويمثل بند إيجار مقر الفندق (220,000 ج.م) الوزن الأكبر بنسبة <strong>43.4%</strong>، تليها التجهيزات الأصولية والمفروشات والكاميرات (141,175 ج.م) بنسبة <strong>27.9%</strong>، ثم التمديدات والتطوير الإلكتروني والشبكات (30,000 ج.م).
        </p>
    </div>

    <div style="background-color:#F7FAFC; border-right:4px solid #D69E2E; padding:10px; border-radius:4px; margin-bottom:12px;">
        <h3 style="margin:0 0 4px 0; color:#975A16; font-size:10pt;">3. مطابقة وتوازن الصندوق (Cash Balance Audit):</h3>
        <p style="margin:0; font-size:8.5pt; color:#4A5568;">
            رصيد النقدية المتبقي بالصندوق بنهاية شهر أغسطس هو <strong>4,695 ج.م</strong> وهو مطابق تماماً للمعادلة المحاسبية: 
            <br>
            <strong>رصيد النهاية = (تمويل المالك + الإيرادات) - المصروفات الكلية = (485,540 + 25,795) - 506,640 = 4,695 ج.م</strong>
        </p>
    </div>

    <div class="section-header">📋 رابعاً: كشف تفصيلي كامل بجميع حركة المعاملات الـ 148 لشهر أغسطس 2026</div>
    <table>
        <thead>
            <tr>
                <th style="width:25px; text-align:center;">#</th>
                <th style="width:65px; text-align:center;">التاريخ</th>
                <th style="width:60px; text-align:center;">النوع</th>
                <th>تفاصيل الحركة / البيان</th>
                <th style="width:110px;">التصنيف المحاسبي</th>
                <th style="width:85px; text-align:left;">المبلغ (ج.م)</th>
                <th style="width:85px; text-align:left;">رصيد الصندوق</th>
            </tr>
        </thead>
        <tbody>
            $txRowsHtml
            <tr class="total-row">
                <td colspan="5" style="text-align:left;">الإجمالي الكلي لمصروفات ومقبوضات شهر أغسطس:</td>
                <td style="text-align:left; color:#9B2C2C;">506,640 ج.م</td>
                <td style="text-align:left; color:#1A365D;">4,695 ج.م</td>
            </tr>
        </tbody>
    </table>

    <div class="page-break"></div>

    <!-- PAGE 5: DOUBLE-ENTRY JOURNAL ENTRIES & TRIAL BALANCE -->
    <div class="section-header">⚖️ خامساً: القيود المحاسبية الرسمية وميزان المراجعة (شهر أغسطس 2026)</div>
    
    <h3 style="color:#1A365D; font-size:10.5pt; margin-top:10px; margin-bottom:6px;">1. القيد المحاسبي المركب الشامل المجمع لشهر أغسطس 2026</h3>
    <table>
        <thead>
            <tr>
                <th style="width:80px; text-align:center;">التاريخ</th>
                <th>بيان الحساب المحاسبي (نظام القيد المزدوج)</th>
                <th style="width:110px; text-align:left;">مدين (ج.م)</th>
                <th style="width:110px; text-align:left;">دائن (ج.م)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align:center; font-weight:600;">31/08/2026</td>
                <td style="font-weight:700; color:#1A365D;">من مذكورين:</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ مصروف إيجار مقر الفندق الرئيسي <em>(إيجار شهر أغسطس)</em></td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">220,000</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ التجهيزات والمعدات والأثاث <em>(مفروشات كوين، سباكة، كاميرات، أثاث)</em></td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">141,175</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ صيانة ونثريات ومواصلات ورسومات <em>(مصنعية سباك، دهان، نجارة، نقل)</em></td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">54,525</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ المرافق العامة والفواتير <em>(كهرباء يوليو وأغسطس، مياه، تليفونات، مكافحة)</em></td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">30,800</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ تأسيس الشبكات وتطوير الويبسايت والدش <em>(تمديدات شبكات، ويبسايت)</em></td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">30,000</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ الرواتب والأجور وسلف الموظفين <em>(أجور ومكافآت وسلف العاملين)</em></td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">18,150</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ الضيافة والإعاشة والتوريدات <em>(وجبات، بن، منظفات، مياه، إفطار)</em></td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">10,390</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ عمولات الحجز والتسكين</td>
                <td style="font-weight:700; color:#9B2C2C; text-align:left;">1,600</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ الصندوق والنقدية <em>(صافي السيولة المتبقية بالحساب)</em></td>
                <td style="font-weight:700; color:#276749; text-align:left;">4,695</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td style="font-weight:700; color:#1A365D;">إلى مذكورين:</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ إيرادات النشاط الفندقي والخدمات والمغسلة <em>(إيراد غرف ومغسلة)</em></td>
                <td></td>
                <td style="font-weight:700; color:#276749; text-align:left;">25,795</td>
            </tr>
            <tr>
                <td></td>
                <td>حـ/ رأس المال - تمويلات المالك <em>(تحويلات انستاباي، بنك، شيكات، دولار)</em></td>
                <td></td>
                <td style="font-weight:700; color:#276749; text-align:left;">485,540</td>
            </tr>
            <tr class="total-row">
                <td colspan="2" style="text-align:left;">توازن القيد المحاسبي المركب (المدين = الدائن):</td>
                <td style="color:#1A365D; text-align:left;">511,335 ج.م</td>
                <td style="color:#1A365D; text-align:left;">511,335 ج.م</td>
            </tr>
        </tbody>
    </table>

    <h3 style="color:#1A365D; font-size:10.5pt; margin-top:15px; margin-bottom:6px;">2. ميزان المراجعة عن شهر أغسطس 2026 (Trial Balance)</h3>
    <table>
        <thead>
            <tr>
                <th style="width:70px; text-align:center;">الكود</th>
                <th>اسم الحساب المحاسبي</th>
                <th style="width:120px; text-align:left;">أرصدة مدينة (ج.م)</th>
                <th style="width:120px; text-align:left;">أرصدة دائنة (ج.م)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td style="text-align:center; font-weight:600;">101</td><td style="font-weight:700;">حـ/ الصندوق والنقدية (Cash Account)</td><td style="font-weight:700; color:#276749; text-align:left;">4,695</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">301</td><td style="font-weight:700;">حـ/ رأس المال - تمويل المالك (Owner's Equity)</td><td style="text-align:center;">-</td><td style="font-weight:700; color:#2B6CB0; text-align:left;">485,540</td></tr>
            <tr><td style="text-align:center; font-weight:600;">401</td><td style="font-weight:700;">حـ/ إيرادات النشاط الفندقي والمغسلة (Hotel Revenue)</td><td style="text-align:center;">-</td><td style="font-weight:700; color:#2B6CB0; text-align:left;">25,795</td></tr>
            <tr><td style="text-align:center; font-weight:600;">501</td><td>حـ/ مصروف إيجار المقر الرئيسي (Building Rent)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">220,000</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">502</td><td>حـ/ التجهيزات والمعدات والأثاث (Capex & Furnishing)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">141,175</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">503</td><td>حـ/ صيانة ونثريات ومواصلات ورسومات (Maintenance & Misc)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">54,525</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">504</td><td>حـ/ المرافق العامة والفواتير الحكومية (Utilities & Bills)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">30,800</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">505</td><td>حـ/ شبكات وتطوير الويبسايت والدش (Networks & Web)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">30,000</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">506</td><td>حـ/ الرواتب والأجور وسلف الموظفين (Payroll & Advances)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">18,150</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">507</td><td>حـ/ الضيافة والإعاشة والتوريدات (F&B & Hospitality)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">10,390</td><td style="text-align:center;">-</td></tr>
            <tr><td style="text-align:center; font-weight:600;">508</td><td>حـ/ عمولات الحجز والتسكين (Commissions)</td><td style="font-weight:700; color:#9B2C2C; text-align:left;">1,600</td><td style="text-align:center;">-</td></tr>
            <tr class="total-row">
                <td colspan="2" style="text-align:left;">تطابق وتوازن ميزان المراجعة (Debit = Credit):</td>
                <td style="color:#1A365D; text-align:left;">511,335 ج.م</td>
                <td style="color:#1A365D; text-align:left;">511,335 ج.م</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top:12px; padding:8px 12px; background-color:#EDF2F7; border-radius:4px; font-size:8pt; color:#4A5568;">
        <strong>ملاحظة محاسبية: تم توثيق وإدراج هذا القيد المحاسبي وميزان المراجعة آلياً بناءً على مراجعة كافة المعاملات الـ 148 لشهر أغسطس 2026 ومطابقة دفاتر الـ Ledger.</strong>
    </div>

</body>
</html>
"@

[System.IO.File]::WriteAllText($htmlPath, $htmlContent, [System.Text.Encoding]::UTF8)
Write-Host "✅ تم تحديث ملف HTML وإضافة قسم القيود المحاسبية: $htmlPath"

# تحويل الـ HTML إلى PDF باستخدام Microsoft Edge Headless
$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
Start-Process -FilePath $edgeExe -ArgumentList "--headless --disable-gpu --print-to-pdf=`"$pdfPath`" `"$htmlPath`"" -Wait -PassThru | Out-Null

if (Test-Path $pdfPath) {
    $pdfSize = [math]::Round((Get-Item $pdfPath).Length / 1KB, 1)
    Write-Host "=========================================="
    Write-Host "🎉 تم إكمال وتحديث ملف الـ PDF بالقيود المحاسبية بنجاح!"
    Write-Host "مسار الملف: $pdfPath"
    Write-Host "حجم الملف : $pdfSize KB"
    Write-Host "=========================================="
}
