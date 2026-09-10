# analyze_vendors.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ledgerPath = "D:\Henu\01_Accounting_System\memory\ledger.json"
$ledger = Get-Content $ledgerPath -Raw | ConvertFrom-Json
$allTx  = @($ledger.transactions | Where-Object { $_.amount -gt 0 })

Write-Host "=== فحص قيود الموردين والمقاولين ==="

# تجميع القيود الخاصة بالموردين والمقاولين والمشتريات التجهيزية
$vendorKeywords = "كوين|مفروشات|علاء|كهربائي|كاميرات|أحمد الكاميرات|احمد كاميرات|نجار|فرج|روماني|مرايات|سباكة|سباك|نقاش|نقاشة|كهرباء|رسيفر|كراسي|أمازون|مكافحة|مغسلة"

$vendorTx = $allTx | Where-Object { $_.category -eq "تجهيزات وصيانة وأثاث" -or $_.category -eq "موردون" -or $_.description -match $vendorKeywords }

Write-Host "عدد القيود المستخرجة: $($vendorTx.Count)"

# تصنيف حسب المورد
$grouped = $vendorTx | Group-Object {
    $d = $_.description
    if ($d -match "كوين|مفروشات") { "شركة كوين لتصنيع وتجهيز المنسوجات والمفروشات" }
    elseif ($d -match "علاء|كهربائي") { "علاء الكهربائي (أعمال الكهرباء والتركيبات)" }
    elseif ($d -match "كاميرا|كاميرات") { "أحمد الكاميرات (نظام المراقبة والكاميرات)" }
    elseif ($d -match "نجار|نجارة|سرير|براويز|أبواب|فرج") { "فرج النجار (أعمال النجارة والتجميع)" }
    elseif ($d -match "روماني|مرايات") { "روماني (توريد وتركيب المرايات)" }
    elseif ($d -match "سباك|سباكة|حوض|خلاط") { "مورد ومقاول السباكة والصحي" }
    elseif ($d -match "نقاش|نقاشة") { "مقاول النقاشة والدهانات" }
    elseif ($d -match "رسيفر|سلك دش") { "مورد الرسيفرات وكابلات الدش" }
    elseif ($d -match "كراسي") { "مورد الكراسي والأثاث" }
    elseif ($d -match "أمازون|أطباق|أكواب") { "أمازون (أدوات المطبخ والأطباق الصيني)" }
    elseif ($d -match "مكافحة") { "شركة مكافحة الحشرات والقوارض" }
    elseif ($d -match "مغسلة|غسيل") { "المغسلة (غسيل وتجهيز المفروشات والسجاد)" }
    else { "موردون ومشتريات متنوعة" }
}

foreach ($g in $grouped | Sort-Object Count -Descending) {
    $sum = ($g.Group | Measure-Object amount -Sum).Sum
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "📦 المورد: $($g.Name)"
    Write-Host "إجمالي المدفوعات: $("{0:N0}" -f $sum) ج.م | عدد القيود: $($g.Count)"
    Write-Host "------------------------------------------"
    foreach ($item in $g.Group) {
        Write-Host "  - [$($item.date)] $($item.description) : $("{0:N0}" -f $item.amount) ج.م | ملاحظات: $($item.notes)"
    }
}
