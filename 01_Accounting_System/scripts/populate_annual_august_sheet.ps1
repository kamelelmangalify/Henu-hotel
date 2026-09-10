# populate_annual_august_sheet.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$annualPath = "D:\Henu\سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"
$copyPath   = "D:\Henu\Copy of سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

Write-Host "════════════════════════════════════════════════════"
Write-Host "  🔄 نقل وتحديث معاملات شهر أغسطس في الملف السنوي..."
Write-Host "════════════════════════════════════════════════════"

$wbCopy   = $excel.Workbooks.Open((Resolve-Path $copyPath).Path)
$sCopy    = $wbCopy.Sheets.Item("اغسطس")

$wbAnnual = $excel.Workbooks.Open((Resolve-Path $annualPath).Path)
$sAnnual  = $wbAnnual.Sheets.Item("08-أغسطس")

# قراءة الصفوف الممتلئة من شيت "اغسطس" بالملف المنسوخ
$copyRows = $sCopy.UsedRange.Rows.Count

# إزالة الصفوف القديمة في الشيت السنوي إن وجدت وإعادة الهيكلة
# محو البيانات من Row 5 إلى الصف قبل الأخير
$annUsedRows = $sAnnual.UsedRange.Rows.Count

# نسخ صفوف البيانات من copy إلى annual
$targetRow = 5
for ($r = 5; $r -lt $copyRows; $r++) {
    $date   = $sCopy.Cells.Item($r, 2).Text
    $permit = $sCopy.Cells.Item($r, 4).Text
    $desc   = $sCopy.Cells.Item($r, 5).Text
    $recv   = $sCopy.Cells.Item($r, 6).Text
    $expVal = $sCopy.Cells.Item($r, 7).Value2
    $revVal = $sCopy.Cells.Item($r, 8).Value2
    $inv    = $sCopy.Cells.Item($r, 9).Text
    $notes  = $sCopy.Cells.Item($r, 12).Text

    if ($desc -or $expVal -gt 0 -or $revVal -gt 0) {
        # التأكد من وجود صفوف كافية قبل صف الإجمالي
        if ($targetRow -ge 35) {
            # إدراج صف جديد فوق صف الإجمالي
            $totRow = $targetRow
            $sAnnual.Rows($totRow).Insert(-4121, 0)
        }

        $sAnnual.Cells.Item($targetRow, 1).Value2 = ($targetRow - 4)
        $sAnnual.Cells.Item($targetRow, 2).Value2 = $date
        $sAnnual.Cells.Item($targetRow, 4).Value2 = $permit
        $sAnnual.Cells.Item($targetRow, 5).Value2 = $desc
        $sAnnual.Cells.Item($targetRow, 6).Value2 = $recv
        if ($expVal -gt 0) { $sAnnual.Cells.Item($targetRow, 7).Value2 = $expVal }
        if ($revVal -gt 0) { $sAnnual.Cells.Item($targetRow, 8).Value2 = $revVal }
        $sAnnual.Cells.Item($targetRow, 9).Value2 = $inv
        
        # صيغ الرصيد المتبقي والتنبيه
        $prevR = $targetRow - 1
        $sAnnual.Cells.Item($targetRow, 10).Formula = "=J$prevR-G$targetRow+H$targetRow"
        $sAnnual.Cells.Item($targetRow, 11).Formula = "=IF(J$targetRow<200,""تنبيه: أعد التعبئة"",""مقبول"")"
        $sAnnual.Cells.Item($targetRow, 12).Value2 = $notes

        $targetRow++
    }
}

# تحديث صف الإجمالي
$totRowFinal = $targetRow
$sAnnual.Cells.Item($totRowFinal, 1).Value2 = "الاجمالي"
$sAnnual.Cells.Item($totRowFinal, 1).Font.Bold = $true
$sAnnual.Cells.Item($totRowFinal, 7).Formula = "=SUM(G4:G$($totRowFinal - 1))"
$sAnnual.Cells.Item($totRowFinal, 7).Font.Bold = $true
$sAnnual.Cells.Item($totRowFinal, 7).NumberFormat = "#,##0"

$sAnnual.Cells.Item($totRowFinal, 8).Formula = "=SUM(H4:H$($totRowFinal - 1))"
$sAnnual.Cells.Item($totRowFinal, 8).Font.Bold = $true
$sAnnual.Cells.Item($totRowFinal, 8).NumberFormat = "#,##0"

# حدود جدول أغسطس
$sAnnual.Range("A3:N$totRowFinal").Borders.LineStyle = 1

# تحديث شيت داشبورد مجمع الشهور لاستخدام الصف النهائي لإجمالي أغسطس
$sDash1 = $wbAnnual.Sheets.Item("داشبورد_مجمع_الشهور")
$sDash1.Cells.Item(12, 4).Formula = "='08-أغسطس'!H$totRowFinal" # إيرادات أغسطس
$sDash1.Cells.Item(12, 5).Formula = "='08-أغسطس'!G$totRowFinal" # مصروفات أغسطس
$sDash1.Cells.Item(12, 7).Formula = "='08-أغسطس'!J$totRowFinal" # رصيد نهاية أغسطس

Write-Host "✅ تم تعبئة شيت '08-أغسطس' بـ $($targetRow - 5) معاملة بنجاح!"

$wbCopy.Close($false)
$wbAnnual.Save()
$wbAnnual.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "===================================================="
Write-Host "🎉 تم حفظ وتطبيق معاملات أغسطس بالكامل في الملف السنوي!"
Write-Host "===================================================="
