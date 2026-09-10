# add_3_sheets.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "D:\Henu\سجل الايرادات والمصروفات.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open((Resolve-Path $filePath).Path)

Write-Host "Current Sheets Count: $($wb.Sheets.Count)"
foreach ($s in $wb.Sheets) {
    Write-Host " - $($s.Name)"
}

# إذا كان عدد الشيتات أقل من 5، ننشئ الشيتات المتبقية ليكون لدينا 3 شيتات جديدة جاهزة
# الشيتات الحالية: 1-A Petty Cash, Sheet1, 1-B Petty Cash
# الشيتات الجديدة المستهدفة: Sheet2, Sheet3, Sheet4 (أو 1-C Petty Cash, 1-D Petty Cash, 1-E Petty Cash)

while ($wb.Sheets.Count -lt 5) {
    $idx = $wb.Sheets.Count
    $srcSheet = $wb.Sheets.Item($idx)
    $srcSheet.Copy([System.Type]::Missing, $srcSheet)
    
    $newSheet = $wb.Sheets.Item($wb.Sheets.Count)
    $prevSheetName = $srcSheet.Name
    $newSheetName = "Sheet$($idx)"
    $newSheet.Name = $newSheetName
    
    Write-Host "✅ Created Sheet '$newSheetName' linked to '$prevSheetName'"
    
    # تحديث معادلات المنقول
    $newSheet.Cells.Item(4, 1).Value2 = "منقول"
    $newSheet.Cells.Item(4, 7).Formula = "='$prevSheetName'!G35"
    $newSheet.Cells.Item(4, 8).Formula = "='$prevSheetName'!H35"
    $newSheet.Cells.Item(4, 10).Formula = "=C4-G4+H4"
    $newSheet.Cells.Item(4, 11).Formula = '=IF(J4<200,"تنبيه: اعد التعبئة","مقبول")'

    # تنظيف صفوف البيانات (5 إلى 34)
    for ($r = 5; $r -le 34; $r++) {
        $newSheet.Cells.Item($r, 1).Value2 = ""
        $newSheet.Cells.Item($r, 2).Value2 = ""
        $newSheet.Cells.Item($r, 3).Value2 = ""
        $newSheet.Cells.Item($r, 4).Value2 = ""
        $newSheet.Cells.Item($r, 5).Value2 = ""
        $newSheet.Cells.Item($r, 6).Value2 = ""
        $newSheet.Cells.Item($r, 7).Value2 = ""
        $newSheet.Cells.Item($r, 8).Value2 = ""
        $newSheet.Cells.Item($r, 9).Value2 = ""
        $newSheet.Cells.Item($r, 12).Value2 = ""
        $newSheet.Cells.Item($r, 13).Value2 = ""
        $newSheet.Cells.Item($r, 14).Value2 = ""

        $prevR = $r - 1
        $newSheet.Cells.Item($r, 10).Formula = "=J$prevR-G$r+H$r"
        $newSheet.Cells.Item($r, 11).Formula = "=IF(J$r<200,""تنبيه: اعد التعبئة"",""مقبول"")"
    }

    # مجاميع صف 35
    $newSheet.Cells.Item(35, 1).Value2 = "الاجمالي"
    $newSheet.Cells.Item(35, 7).Formula = "=SUM(G4:G34)"
    $newSheet.Cells.Item(35, 8).Formula = "=SUM(H4:H34)"
}

$wb.Save()
$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "✅ تم تحديث ملف الإكسيل الرئيسي وجاهز بجميع الشيتات!"
