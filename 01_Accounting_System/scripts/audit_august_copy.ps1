# audit_august_copy.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\Copy of سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)
$s = $wb.Sheets.Item("اغسطس")

$usedRows = $s.UsedRange.Rows.Count

$txList = @()

for ($r = 4; $r -lt $usedRows; $r++) {
    $num    = $s.Cells.Item($r, 1).Text
    $date   = $s.Cells.Item($r, 2).Text
    $desc   = $s.Cells.Item($r, 5).Text
    $expStr = $s.Cells.Item($r, 7).Text
    $revStr = $s.Cells.Item($r, 8).Text
    $balStr = $s.Cells.Item($r, 10).Text
    $notes  = $s.Cells.Item($r, 12).Text

    $expVal = 0; if ($expStr -match "[\d\.]+") { $expVal = [double]($expStr -replace "[^\d\.]", "") }
    $revVal = 0; if ($revStr -match "[\d\.]+") { $revVal = [double]($revStr -replace "[^\d\.]", "") }
    $balVal = 0; if ($balStr -match "[\d\.]+") { $balVal = [double]($balStr -replace "[^\d\.]", "") }

    if ($desc -or $expVal -gt 0 -or $revVal -gt 0) {
        # التصنيف المحاسبي
        $cat = ""
        $type = ""

        if ($revVal -gt 0) {
            if ($desc -match "تمويل|انستا|بنكي|رأس المال|تحويل") {
                $type = "تمويل المالك"
                $cat  = "تمويلات المالك"
            } elseif ($desc -match "مغسلة") {
                $type = "إيراد"
                $cat  = "إيراد مغسلة"
            } else {
                $type = "إيراد"
                $cat  = "إيراد غرف"
            }
        } elseif ($expVal -gt 0) {
            $type = "مصروف"
            $d = $desc.ToLower()
            if ($d -match "ايجار شهر|إيجار شهر|إيجار المقر|ايجار فندق|ايجار المبنى|إيجار المكان") {
                $cat = "إيجار مقر الفندق"
            } elseif ($d -match "سلفة|سلف|مرتب|راتب|مبيت|مكافأة") {
                if ($d -match "سلفة|سلف") { $cat = "سلف موظفين" } else { $cat = "رواتب وأجور" }
            } elseif ($d -match "كهرباء|مياه|غاز|انترنت|تليفون|تليفونات") {
                $cat = "مرافق وفواتير حكومية"
            } elseif ($d -match "كوين|مفروشات|سباكة|سباك|كاميرات|أثاث|كراسي|أمازون|رسيفر|سلك دش|مرايات|روماني|ملة سرير|أطباق|أكواب") {
                $cat = "تجهيزات ومعدات وأثاث"
            } elseif ($d -match "شبكات|ويبسايت|سلوك ووصلات") {
                $cat = "شبكات وتطوير ويبسايت"
            } elseif ($d -match "افطار|وجبة|بن|أكل|ضيافة|منظفات|معطر|قمامة|ماء|مياه|نسكافيه|كباب|ماكدوتالدز|بيزا|ثلج|شاليموه|لبن|بخور|صابون|مناديل|هدايا") {
                $cat = "ضيافة وإعاشة وتوريدات"
            } elseif ($d -match "عمولة") {
                $cat = "عمولات حجز"
            } else {
                $cat = "صيانة ونثريات ومواصلات"
            }
        }

        $txList += [PSCustomObject]@{
            Row         = $r
            Date        = $date
            Type        = $type
            Category    = $cat
            Description = $desc
            Expense     = $expVal
            Revenue     = $revVal
            Balance     = $balVal
            Notes       = $notes
        }
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "=========================================="
Write-Host "📊 نتائج التحقيق والمراجعة المحاسبية لشهر أغسطس:"
Write-Host "=========================================="
Write-Host "إجمالي عدد القيود : $($txList.Count)"
Write-Host "إجمالي التمويلات  : $("{0:N0}" -f ($txList | Where-Object Type -eq "تمويل المالك" | Measure-Object Revenue -Sum).Sum) ج.م"
Write-Host "إجمالي الإيرادات  : $("{0:N0}" -f ($txList | Where-Object Type -eq "إيراد"       | Measure-Object Revenue -Sum).Sum) ج.م"
Write-Host "إجمالي المصروفات : $("{0:N0}" -f ($txList | Where-Object Type -eq "مصروف"      | Measure-Object Expense -Sum).Sum) ج.م"
Write-Host "رصيد الصندوق النهائي: $("{0:N0}" -f ($txList[-1].Balance)) ج.م"
Write-Host "------------------------------------------"
Write-Host "📁 تفكيك المصروفات حسب التصنيف المحاسبي:"
$txList | Where-Object Type -eq "مصروف" | Group-Object Category | ForEach-Object {
    $sum = ($_.Group | Measure-Object Expense -Sum).Sum
    Write-Host "  • $($_.Name): $("{0:N0}" -f $sum) ج.م ($($_.Count) معاملة)"
}
Write-Host "------------------------------------------"
Write-Host "💰 تفكيك المقبوضات والتمويلات حسب التصنيف:"
$txList | Where-Object Type -ne "مصروف" | Group-Object Category | ForEach-Object {
    $sum = ($_.Group | Measure-Object Revenue -Sum).Sum
    Write-Host "  • $($_.Name): $("{0:N0}" -f $sum) ج.م ($($_.Count) معاملة)"
}
Write-Host "=========================================="
