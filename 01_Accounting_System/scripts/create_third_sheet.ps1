# ================================================================
# create_third_sheet.ps1
# ينشئ شيت ثالث جديد بنفس تنسيق وصيغ الشيتات السابقة
# وينقل الرصيد والمجاميع تلقائياً من Sheet1
# ================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\سجل الايرادات والمصروفات.xlsx"
$excel    = New-Object -ComObject Excel.Application
$excel.Visible       = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

    # 1. النسخ المتطابق من Sheet1
    $srcSheet = $wb.Sheets.Item("Sheet1")
    $lastSheet = $wb.Sheets.Item($wb.Sheets.Count)

    # نسخ الشيت المصدر ووضعه بعد أحدث شيت
    $srcSheet.Copy([System.Type]::Missing, $lastSheet)

    # الشيت الجديد المنشأ
    $newSheet = $wb.Sheets.Item($wb.Sheets.Count)
    $newSheet.Name = "1-B Petty Cash"   # اسم الشيت الثالث

    Write-Host "✅ تم إنشاء الشيت الجديد باسم: '$($newSheet.Name)'"

    # 2. تحديث قيد "منقول" (Row 4) للربط بالمجاميع النهائية للشيت السابق Sheet1
    $newSheet.Cells.Item(4, 1).Value2 = "منقول"
    $newSheet.Cells.Item(4, 7).Formula = "='Sheet1'!G35"
    $newSheet.Cells.Item(4, 8).Formula = "='Sheet1'!H35"
    $newSheet.Cells.Item(4, 10).Formula = "=C4-G4+H4"
    $newSheet.Cells.Item(4, 11).Formula = '=IF(J4<200,"تنبيه: اعد التعبئة","مقبول")'

    # 3. تنظيف صفوف البيانات (من الصف 5 إلى الصف 34) للحفاظ على التنسيقات والصيغ فقط
    for ($r = 5; $r -le 34; $r++) {
        $newSheet.Cells.Item($r, 1).Value2 = ""   # رقم
        $newSheet.Cells.Item($r, 2).Value2 = ""   # التاريخ
        $newSheet.Cells.Item($r, 3).Value2 = ""   # رصيد افتتاحي
        $newSheet.Cells.Item($r, 4).Value2 = ""   # رقم الاذن
        $newSheet.Cells.Item($r, 5).Value2 = ""   # البيان
        $newSheet.Cells.Item($r, 6).Value2 = ""   # الجهة المستلمة
        $newSheet.Cells.Item($r, 7).Value2 = ""   # مصروف
        $newSheet.Cells.Item($r, 8).Value2 = ""   # إيراد
        $newSheet.Cells.Item($r, 9).Value2 = ""   # رقم الفاتورة
        $newSheet.Cells.Item($r, 12).Value2 = ""  # ملاحظات
        $newSheet.Cells.Item($r, 13).Value2 = ""  # توقيع الصراف
        $newSheet.Cells.Item($r, 14).Value2 = ""  # توقيع المراجع

        # إعادة ضبط صيغ الرصيد والتنبيه لكل صف
        $prevR = $r - 1
        $newSheet.Cells.Item($r, 10).Formula = "=J$prevR-G$r+H$r"
        $newSheet.Cells.Item($r, 11).Formula = "=IF(J$r<200,""تنبيه: اعد التعبئة"",""مقبول"")"
    }

    # 4. التأكد من صيغ صف "الاجمالي" (Row 35)
    $newSheet.Cells.Item(35, 1).Value2 = "الاجمالي"
    $newSheet.Cells.Item(35, 7).Formula = "=SUM(G4:G34)"
    $newSheet.Cells.Item(35, 8).Formula = "=SUM(H4:H34)"

    # حفظ الملف
    $wb.Save()
    Write-Host "✅ تم حفظ الملف بنجاح مع إضافة الشيت الثالث وتفعيل الصيغ والمطابقة!"

} catch {
    Write-Host "❌ خطأ أثناء إنشاء الشيت: $($_.Exception.Message)"
} finally {
    if ($wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
