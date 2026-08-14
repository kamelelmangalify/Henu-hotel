#Requires -Version 7
$imgs = Get-Content "D:\Henu\accountant\reports\images_b64.json" -Raw | ConvertFrom-Json
$recImg = $imgs.rec
$hkImg  = $imgs.hk

$htmlContent = @"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تقرير إنجازات وتحديثات العمل - هوستل الأهرامات</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        
        @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
            @bottom-right {
                content: "صفحة " counter(page) " من " counter(pages);
                font-family: 'Cairo', sans-serif;
                font-size: 9pt;
                color: #718096;
            }
        }

        body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #2d3748;
            background-color: #fff;
            margin: 0;
            padding: 0;
            font-size: 10.5pt;
            line-height: 1.6;
        }

        .header {
            border-bottom: 3px solid #1a365d;
            padding-bottom: 12px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .company-title {
            font-size: 24pt;
            font-weight: 800;
            color: #1a365d;
            margin: 0;
            line-height: 1.2;
        }

        .subtitle {
            font-size: 12pt;
            color: #4a5568;
            margin-top: 5px;
            font-weight: 600;
        }

        .report-meta {
            text-align: left;
            font-size: 9.5pt;
            color: #4a5568;
            background-color: #f7fafc;
            padding: 10px 14px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }

        .recipient-box {
            background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
            border-right: 5px solid #2b6cb0;
            padding: 12px 18px;
            border-radius: 6px;
            margin-bottom: 25px;
            font-size: 12pt;
            font-weight: 700;
            color: #1a365d;
        }

        .section-card {
            background-color: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            page-break-inside: avoid;
        }

        .section-title {
            color: #1a365d;
            font-size: 13.5pt;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid #edf2f7;
            padding-bottom: 8px;
        }

        .section-number {
            background-color: #2b6cb0;
            color: white;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;
            font-size: 11pt;
            font-weight: 800;
        }

        .item-group {
            margin-bottom: 12px;
        }

        .item-group:last-child {
            margin-bottom: 0;
        }

        .item-label {
            font-weight: 700;
            color: #2c5282;
            font-size: 11pt;
            margin-bottom: 3px;
        }

        .item-desc {
            color: #4a5568;
            text-align: justify;
        }

        .uniform-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }

        .uniform-card {
            background-color: #f7fafc;
            border: 1px solid #cbd5e0;
            border-radius: 8px;
            overflow: hidden;
            text-align: center;
        }

        .uniform-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-bottom: 1px solid #e2e8f0;
        }

        .uniform-card-caption {
            padding: 10px;
            font-weight: 700;
            color: #2d3748;
            font-size: 10pt;
        }

        .highlight-box {
            background-color: #fffaf0;
            border-right: 4px solid #dd6b20;
            padding: 12px 15px;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 10pt;
            color: #744210;
        }

        .page-break {
            page-break-before: always;
        }

        .footer {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            text-align: center;
            font-size: 9pt;
            color: #a0aec0;
        }
    </style>
</head>
<body>

    <!-- الهيدر -->
    <div class="header">
        <div>
            <h1 class="company-title">هوستل الأهرامات (Henu Hotel)</h1>
            <div class="subtitle">تقرير إنجازات وتحديثات العمل الميداني والتشغيلي</div>
        </div>
        <div class="report-meta">
            <div><b>الفترة:</b> 4 أغسطس 2026 - 8 أغسطس 2026</div>
            <div><b>تاريخ التقرير:</b> 8 أغسطس 2026</div>
            <div><b>جهة الإصدار:</b> إدارة الفندق والتطوير</div>
        </div>
    </div>

    <!-- الموجه إليه -->
    <div class="recipient-box">
        إلى: السيد / محمد مرسي (مالك الفندق) المحترم
    </div>

    <!-- 1. إدارة الموارد البشرية والتعيينات -->
    <div class="section-card">
        <div class="section-title">
            <span class="section-number">1</span>
            إدارة الموارد البشرية والتعيينات
        </div>
        <div class="item-group">
            <div class="item-label">• تعديل وهيكلة الفريق:</div>
            <div class="item-desc">تم ضبط توزيع الموظفين، استكمال التعيينات للوظائف الشاغرة، والاستغناء عن العناصر غير المناسبة لضمان رفع كفاءة التشغيل.</div>
        </div>
        <div class="item-group">
            <div class="item-label">• تنظيم العمل والشيفتات:</div>
            <div class="item-desc">تم إعداد وتنظيم جداول المواعيد والوردية، بالإضافة إلى تحديث هيكل الرواتب المعتمد كلياً.</div>
        </div>
        <div class="item-group">
            <div class="item-label">• الوثائق والعقود القانونية:</div>
            <div class="item-desc">جاري استكمال مسوغات التعيين لكافة العاملين، مع تحرير عقود عمل مؤقتة لضمان التغطية القانونية وتوثيق العلاقة التعاقدية بين الطرفين.</div>
        </div>
    </div>

    <!-- 2. التجهيزات والمفروشات -->
    <div class="section-card">
        <div class="section-title">
            <span class="section-number">2</span>
            تجهيز المفروشات وصيانة الأدوار (الدورين الثالث والرابع)
        </div>
        <div class="item-group">
            <div class="item-label">• الاتفاق على التوريد:</div>
            <div class="item-desc">تم الاتفاق النهائياً على توريد كافة المفروشات الفندقية الخاصة بالدورين الثالث والرابع.</div>
        </div>
        <div class="item-group">
            <div class="item-label">• خريطة وخطة التجهيز والصيانة بالتتابع:</div>
            <div class="item-desc">يتم العمل حالياً بالدور الرابع المقسم والمفروش جزئياً لاستكمال بعض الصيانة واللوازم والتجهيزات المطلوبة، ثم الانتقال بالتتابع للدور الثالث والتدرج بباقي الأدوار.</div>
        </div>
        <div class="item-group">
            <div class="item-label">• أعمال الصيانة التخصصية:</div>
            <div class="item-desc">تم الاتفاق مع فني صيانة لمراجعة شبكة الإضاءة وتجهيز وحدات التكييف بكافة الغرف.</div>
        </div>
        <div class="item-group">
            <div class="item-label">• الجدول الزمني:</div>
            <div class="item-desc">من المقرر الانتهاء الكامل من تجهيز وفرش الدورين الثالث والرابع وجاهزيتهما التامة للاستخدام قبل 15 أغسطس.</div>
        </div>
    </div>

    <!-- 3. أعمال النظافة ومكافحة الآفات -->
    <div class="section-card">
        <div class="section-title">
            <span class="section-number">3</span>
            أعمال النظافة ومكافحة الآفات
        </div>
        <div class="item-group">
            <div class="item-label">• الرش والإبادة الوقائية:</div>
            <div class="item-desc">تم تنفيذ المرحلة الأولى من رش ومكافحة الحشرات اليوم، وستستكمل المرحلة الثانية والأخيرة غداً لضمان جاهزية الغرف والممرات بالكامل لاستقبال النزلاء.</div>
        </div>
    </div>

    <div class="page-break"></div>

    <!-- 4. الزي الموحد للعاملين (Uniform) -->
    <div class="section-card">
        <div class="section-title">
            <span class="section-number">4</span>
            مقترح الزي الموحد للعاملين (Uniform) - للعرض ولاتخاذ موافقة وتوجيه المالك
        </div>
        <div class="item-desc">نعرض على سيادتكم العينات والتصاميم المقترحة للزي الموحد للاطلاع ولاتخاذ موافقتكم الكريمة أو بيان أي ملاحظات/رأي لسيادتكم:</div>
        
        <div class="uniform-grid">
            <div class="uniform-card">
                <img src="$recImg" alt="زي الاستقبال">
                <div class="uniform-card-caption">
                    <div style="color: #1a365d; font-size: 11pt;">موظفو الاستقبال (Reception)</div>
                    <div style="color: #4a5568; font-weight: normal; margin-top: 4px;">بنطال كحلي + قميص لبني</div>
                </div>
            </div>
            <div class="uniform-card">
                <img src="$hkImg" alt="زي الإشراف الداخلي">
                <div class="uniform-card-caption">
                    <div style="color: #1a365d; font-size: 11pt;">فريق الإشراف الداخلي (Housekeeping)</div>
                    <div style="color: #4a5568; font-weight: normal; margin-top: 4px;">بنطال أسود + تيشرت بولو أورانج</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 5. الأنظمة المالية وحجوزات الغرف -->
    <div class="section-card">
        <div class="section-title">
            <span class="section-number">5</span>
            الأنظمة المالية وحجوزات الغرف
        </div>
        <div class="item-group">
            <div class="item-label">• النظام المحاسبي الآلي (Zoho Books System):</div>
            <div class="item-desc">تم تشغيل النظام المحاسبي وتجهيز معظمه (تم إرسال نموذج من التقارير المستخرجة للاطلاع)، وجاري استكمال باقي الخصائص خلال أيام معدودة.</div>
        </div>
        <div class="item-group">
            <div class="item-label">• نظام إدارة الغرف والحجوزات (PMS):</div>
            <div class="item-desc">يتم العمل حالياً بشكل منتظم ودقيق عبر شيتات إكسيل مخصصة (Excel Sheet) لحين الانتهاء من ربط وتكامل سيستم الحجوزات الآلي بالكامل.</div>
        </div>
    </div>

    <!-- 6. مقترح تشغيل كافيه الروف (السطوح) -->
    <div class="section-card">
        <div class="section-title">
            <span class="section-number">6</span>
            مقترح تشغيل كافيه الروف (السطوح)
        </div>
        <div class="item-desc" style="margin-bottom: 10px;">
            نظراً لوجود إقبال وكثافة من النزلاء، نوصي بالإسراع في تشغيل كافيه الروف وفق الخطة التالية:
        </div>
        <div class="item-group">
            <div class="item-label">• نموذج التشغيل المبدئي الانتقالي:</div>
            <div class="item-desc">الاستعانة بمتعهد/مشغل خارجي ليدير الكافيه لفترة انتقالية لحين استقرار حركة التشغيل، ثم التقييم إما بالاستمرار معه أو استلام التشغيل المباشر من قبلنا.</div>
        </div>
        <div class="item-group" style="margin-top: 8px;">
            <div class="item-label">• تقديم الأغذية والمشروبات والحماية القانونية:</div>
            <div class="item-desc">التعاقد مع مطاعم وموردين معتمدين (مثل: برغيت أو موردي وجبات منزليّة معتمدين) مع الالتزام بإصدار فواتير رسمية لكل طلب؛ لنقل المسؤولية القانونية والصحية بالكامل على المورد في حال وجود أي ملاحظات.</div>
        </div>

        <div class="highlight-box">
            📌 <b>توصية الإدارة:</b> الموافقة على الخطة الانتقالية لتشغيل كافيه الروف لضمان زيادة رضا النزلاء وتعظيم الإيرادات اليومية للفندق مع تحييد المخاطر التشغيلية.
        </div>
    </div>

    <div class="footer">
        تم إعداد هذا التقرير بواسطة إدارة التشغيل والتطوير لهوستل الأهرامات (Henu Hotel) - 8 أغسطس 2026.
    </div>

</body>
</html>
"@

[System.IO.File]::WriteAllText("D:\Henu\accountant\reports\work_achievements_report.html", $htmlContent, [System.Text.Encoding]::UTF8)
