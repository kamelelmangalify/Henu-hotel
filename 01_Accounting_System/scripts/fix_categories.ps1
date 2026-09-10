# fix_categories.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ledgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"
$ledger = Get-Content $ledgerPath -Raw | ConvertFrom-Json

$fixedCount = 0

foreach ($tx in $ledger.transactions) {
    $d = $tx.description.ToLower()

    if ($tx.type -eq "مصروف") {
        if ($d -match "ايجار شهر|إيجار شهر|إيجار المقر|ايجار فندق|ايجار المبنى|إيجار المكان") {
            $tx.category = "إيجار المقر"
            $fixedCount++
        }
        elseif ($d -match "عمولة") {
            $tx.category = "عمولات حجز"
            $fixedCount++
        }
        elseif ($d -match "راتب|مرتب|سلفة|سلف|مكافأة|مبيت يوسف|عهدة") {
            if ($d -match "سلفة|سلف") { $tx.category = "سلف موظفين" }
            else { $tx.category = "رواتب ومكافآت" }
            $fixedCount++
        }
        elseif ($d -match "كهرباء|مياه|غاز|انترنت|تليفون|شحن") {
            $tx.category = "مرافق وفاكس"
            $fixedCount++
        }
        elseif ($d -match "افطار|وجبة|بن|أكل|ضيافة|هدايا|منظفات|معطر|قمامة|ماء|مياه|نسكافيه|كباب|ماكدوتالدز|بيزا|ثلج|شاليموه|لبن|بخور|صابون") {
            $tx.category = "ضيافة وإعاشة"
            $fixedCount++
        }
        elseif ($d -match "مفروشات|شركة كوين|علاء الكهربائي|احمد كاميرات|كاميرات|نجار|سباكة|سباك|نقاش|نقاشة|رسيفر|سلك دش|كراسي|مرايات|شبابيك|حوض|خلاط|سقالة|تكييف|أمازون|منسوجات|ادوات مكتبية|كشكول|تابلوهات|براويز|زاوية ومسامير|الوان لرسم") {
            $tx.category = "تجهيزات وصيانة وأثاث"
            $fixedCount++
        }
        else {
            $tx.category = "مصروفات نثرية ومواصلات"
            $fixedCount++
        }
    }
    elseif ($tx.type -eq "إيراد") {
        if ($d -match "مغسلة|غسيل") {
            $tx.category = "إيراد مغسلة"
            $fixedCount++
        }
        elseif ($d -match "انستاباي|تحويل بنكي|تمويل|رأس المال|شيك|دولار") {
            $tx.category = "تمويل المالك"
            $tx.type = "تمويل المالك"
            $fixedCount++
        }
        else {
            $tx.category = "إيراد غرف"
            $fixedCount++
        }
    }
}

# حفظ التعديلات في ledger.json
$ledger | ConvertTo-Json -Depth 10 | Out-File $ledgerPath -Encoding UTF8
Write-Host "✅ تم إصلاح وتصحيح تصنيفات $($ledger.transactions.Count) معاملة في الـ Ledger بنجاح!"

# عرض تجميع المصروفات والإيرادات بعد التصحيح الدقيق
$allTx = @($ledger.transactions)
$expItems = @($allTx | Where-Object type -eq "مصروف")
$revItems = @($allTx | Where-Object type -eq "إيراد")
$fundItems = @($allTx | Where-Object type -eq "تمويل المالك")

Write-Host ""
Write-Host "=========================================="
Write-Host "📊 إحصائيات شهر أغسطس بعد التصحيح:"
Write-Host "=========================================="
Write-Host "إجمالي تمويلات المالك    : $("{0:N0}" -f ($fundItems | Measure-Object amount -Sum).Sum) ج.م"
Write-Host "إجمالي الإيرادات التشغيلية : $("{0:N0}" -f ($revItems | Measure-Object amount -Sum).Sum) ج.م"
Write-Host "إجمالي المصروفات الكلية  : $("{0:N0}" -f ($expItems | Measure-Object amount -Sum).Sum) ج.م"
Write-Host "------------------------------------------"
Write-Host "📁 تفكيك المصروفات حسب التصنيف الدقيق:"
$expItems | Group-Object category | ForEach-Object {
    $sum = ($_.Group | Measure-Object amount -Sum).Sum
    Write-Host "  • $($_.Name): $("{0:N0}" -f $sum) ج.م ($($_.Count) معاملة)"
}
Write-Host "------------------------------------------"
Write-Host "💰 تفكيك الإيرادات حسب التصنيف الدقيق:"
$revItems | Group-Object category | ForEach-Object {
    $sum = ($_.Group | Measure-Object amount -Sum).Sum
    Write-Host "  • $($_.Name): $("{0:N0}" -f $sum) ج.م ($($_.Count) معاملة)"
}
Write-Host "=========================================="
