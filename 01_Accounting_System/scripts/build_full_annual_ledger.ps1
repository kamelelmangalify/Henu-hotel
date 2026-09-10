# build_full_annual_ledger.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$outPath = "D:\Henu\سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

Write-Host "════════════════════════════════════════════════════"
Write-Host "  🚀 جاري بناء سجل الإيرادات والمصروفات السنوي 2026..."
Write-Host "════════════════════════════════════════════════════"

$wb = $excel.Workbooks.Add()

# -------------------------------------------------------------
# 1. إضافة كود الماكرو الفعال في الموديول
# -------------------------------------------------------------
$vbModule = $wb.VBProject.VBComponents.Add(1)
$vbaCode = @"
Sub AddNewRowToCurrentSheet()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    
    Dim lastRow As Long
    Dim r As Long
    
    ' البحث عن صف الإجمالي
    For r = 1 To 500
        If Trim(ws.Cells(r, 1).Value) = "الاجمالي" Or Trim(ws.Cells(r, 1).Value) = "الإجمالي" Then
            lastRow = r
            Exit For
        End If
    Next r
    
    If lastRow = 0 Then
        MsgBox "عذراً، لم يتم العثور على صف 'الاجمالي' في هذا الشيت.", vbExclamation, "تنبيه"
        GoTo CleanUp
    End If
    
    ' إدراج صف جديد فوق صف الإجمالي مباشرة
    ws.Rows(lastRow).Insert Shift:=xlDown, CopyOrigin:=xlFormatFromLeftOrAbove
    
    Dim newRow As Long
    newRow = lastRow
    Dim prevRow As Long
    prevRow = newRow - 1
    
    ' وضع التنسيقات والصيغ في الصف الجديد
    ws.Cells(newRow, 10).Formula = "=J" & prevRow & "-G" & newRow & "+H" & newRow
    ws.Cells(newRow, 11).Formula = "=IF(J" & newRow & "<200,""تنبيه: أعد التعبئة"",""مقبول"")"
    
    ' تحديث معادلة المجموع في صف الإجمالي الجديد
    Dim totalRow As Long
    totalRow = lastRow + 1
    ws.Cells(totalRow, 7).Formula = "=SUM(G4:G" & newRow & ")"
    ws.Cells(totalRow, 8).Formula = "=SUM(H4:H" & newRow & ")"
    
    ' نقل المؤشر للبيان
    ws.Cells(newRow, 5).Select
    
CleanUp:
    Application.ScreenUpdating = True
    Exit Sub
    
ErrorHandler:
    Application.ScreenUpdating = True
    MsgBox "حدث خطأ أثناء إضافة الصف: " & Err.Description, vbCritical, "خطأ"
End Sub
"@
$vbModule.CodeModule.AddFromString($vbaCode)
Write-Host "✅ تم تفعيل موديول الماكرو 'AddNewRowToCurrentSheet'"

# أسماء الشهور الـ 12
$months = @(
    "01-يناير", "02-فبراير", "03-مارس", "04-أبريل",
    "05-مايو", "06-يونيو", "07-يوليو", "08-أغسطس",
    "09-سبتمبر", "10-أكتوبر", "11-نوفمبر", "12-ديسمبر"
)

# -------------------------------------------------------------
# 2. إنشاء وتنسيق شيتات الشهور الـ 12
# -------------------------------------------------------------
$headers = @("رقم", "التاريخ", "رصيد افتتاحي", "رقم الاذن", "البيان", "الجهة المستلمة", "مصروف (ج)", "إيراد (ج)", "رقم الفاتورة", "رصيد متبقي", "تنبيه", "ملاحظات", "توقيع الصراف", "توقيع المراجع")

for ($mIdx = 0; $mIdx -lt $months.Count; $mIdx++) {
    $mName = $months[$mIdx]
    
    $sheet = if ($mIdx -eq 0) { $wb.Sheets.Item(1) } else { $wb.Sheets.Add([System.Type]::Missing, $wb.Sheets.Item($wb.Sheets.Count)) }
    $sheet.Name = $mName
    $sheet.DisplayRightToLeft = $true

    # Title & Config
    $sheet.Cells.Item(1, 1).Value2 = "هوستل الأهرامات — سجل حركة صندوق المصروفات النثرية والتشغيلية ($mName)"
    $sheet.Cells.Item(1, 1).Font.Bold = $true
    $sheet.Cells.Item(1, 1).Font.Size = 14
    $sheet.Cells.Item(1, 1).Font.Color = 0x1A365D
    $sheet.Range("A1:N1").Merge()

    $sheet.Cells.Item(2, 1).Value2 = "سقف الصندوق (ج):"
    $sheet.Cells.Item(2, 3).Value2 = "حد الانذار (ج):"
    $sheet.Cells.Item(2, 4).Value2 = 5000
    $sheet.Range("A2:D2").Font.Bold = $true

    # زر الماكرو التفاعلي إضافة صف جديد
    $btn = $sheet.Buttons().Add(480, 5, 140, 26)
    $btn.Caption = "➕ إضافة صف جديد"
    $btn.OnAction = "AddNewRowToCurrentSheet"
    $btn.Font.Name = "Segoe UI"
    $btn.Font.Bold = $true
    $btn.Font.Size = 10

    # Headers (Row 3)
    for ($col = 0; $col -lt $headers.Count; $col++) {
        $c = $sheet.Cells.Item(3, $col + 1)
        $c.Value2 = $headers[$col]
        $c.Font.Bold = $true
        $c.Font.Color = 0xFFFFFF
        $c.Interior.Color = 0x1A365D # Dark Blue
        $c.HorizontalAlignment = -4108
    }

    # Row 4 (منقول)
    $sheet.Cells.Item(4, 1).Value2 = "منقول"
    if ($mIdx -eq 0) {
        $sheet.Cells.Item(4, 7).Value2 = 0
        $sheet.Cells.Item(4, 8).Value2 = 0
        $sheet.Cells.Item(4, 10).Formula = "=C4-G4+H4"
    } else {
        $prevM = $months[$mIdx - 1]
        $sheet.Cells.Item(4, 7).Formula = "='$prevM'!G35"
        $sheet.Cells.Item(4, 8).Formula = "='$prevM'!H35"
        $sheet.Cells.Item(4, 10).Formula = "=C4-G4+H4"
    }
    $sheet.Cells.Item(4, 11).Formula = '=IF(J4<200,"تنبيه: أعد التعبئة","مقبول")'

    # Rows 5 to 34 (صفو البيانات الجاهزة)
    for ($r = 5; $r -le 34; $r++) {
        $prevR = $r - 1
        $sheet.Cells.Item($r, 10).Formula = "=J$prevR-G$r+H$r"
        $sheet.Cells.Item($r, 11).Formula = "=IF(J$r<200,""تنبيه: أعد التعبئة"",""مقبول"")"
    }

    # Row 35 (الاجمالي)
    $sheet.Cells.Item(35, 1).Value2 = "الاجمالي"
    $sheet.Cells.Item(35, 1).Font.Bold = $true
    $sheet.Cells.Item(35, 7).Formula = "=SUM(G4:G34)"
    $sheet.Cells.Item(35, 7).Font.Bold = $true
    $sheet.Cells.Item(35, 7).NumberFormat = "#,##0"

    $sheet.Cells.Item(35, 8).Formula = "=SUM(H4:H34)"
    $sheet.Cells.Item(35, 8).Font.Bold = $true
    $sheet.Cells.Item(35, 8).NumberFormat = "#,##0"

    # التنسيقات والحدود
    $rTable = $sheet.Range("A3:N35")
    $rTable.Borders.LineStyle = 1

    # ضبط عروض الأعمدة
    $sheet.Columns.Item(1).ColumnWidth = 8
    $sheet.Columns.Item(2).ColumnWidth = 12
    $sheet.Columns.Item(3).ColumnWidth = 12
    $sheet.Columns.Item(4).ColumnWidth = 10
    $sheet.Columns.Item(5).ColumnWidth = 35
    $sheet.Columns.Item(6).ColumnWidth = 20
    $sheet.Columns.Item(7).ColumnWidth = 14
    $sheet.Columns.Item(8).ColumnWidth = 14
    $sheet.Columns.Item(9).ColumnWidth = 12
    $sheet.Columns.Item(10).ColumnWidth = 14
    $sheet.Columns.Item(11).ColumnWidth = 18
    $sheet.Columns.Item(12).ColumnWidth = 22
    $sheet.Columns.Item(13).ColumnWidth = 14
    $sheet.Columns.Item(14).ColumnWidth = 14

    Write-Host "  ✅ تم إنشاء وتنسيق شيت: '$mName'"
}

# -------------------------------------------------------------
# 3. إنشاء داشبورد مجمع الشهور (Monthly Dashboard)
# -------------------------------------------------------------
$sDash1 = $wb.Sheets.Add([System.Type]::Missing, $wb.Sheets.Item($wb.Sheets.Count))
$sDash1.Name = "داشبورد_مجمع_الشهور"
$sDash1.DisplayRightToLeft = $true

$sDash1.Cells.Item(1, 1).Value2 = "📊 لوحة متابعة ومقارنة الشهور المجمعة (Monthly Summary Dashboard)"
$sDash1.Cells.Item(1, 1).Font.Bold = $true
$sDash1.Cells.Item(1, 1).Font.Size = 16
$sDash1.Cells.Item(1, 1).Font.Color = 0x1A365D
$sDash1.Range("A1:I1").Merge()

$sDash1.Cells.Item(2, 1).Value2 = "تحديث تلقائي مجمع لجميع شهور السنة 2026"
$sDash1.Cells.Item(2, 1).Font.Italic = $true
$sDash1.Cells.Item(2, 1).Font.Size = 10

$d1Headers = @("م", "الشهر", "رصيد بداية الشهر", "إجمالي الإيرادات التشغيلية", "إجمالي المصروفات الكلية", "صافي التغير المالي", "رصيد نهاية الشهر", "حالة الأداء والحالة المالية")

for ($c = 0; $c -lt $d1Headers.Count; $c++) {
    $cell = $sDash1.Cells.Item(4, $c + 1)
    $cell.Value2 = $d1Headers[$c]
    $cell.Font.Bold = $true
    $cell.Font.Color = 0xFFFFFF
    $cell.Interior.Color = 0x2B6CB0 # Blue Header
    $cell.HorizontalAlignment = -4108
}

for ($mIdx = 0; $mIdx -lt $months.Count; $mIdx++) {
    $mName = $months[$mIdx]
    $r = $mIdx + 5
    
    $sDash1.Cells.Item($r, 1).Value2 = ($mIdx + 1)
    $sDash1.Cells.Item($r, 2).Value2 = $mName
    
    # رصيد أول الشهر
    $sDash1.Cells.Item($r, 3).Formula = "='$mName'!J4"
    
    # إجمالي الإيرادات
    $sDash1.Cells.Item($r, 4).Formula = "='$mName'!H35"
    
    # إجمالي المصروفات
    $sDash1.Cells.Item($r, 5).Formula = "='$mName'!G35"
    
    # صافي التغير
    $sDash1.Cells.Item($r, 6).Formula = "=D$r-E$r"
    
    # رصيد نهاية الشهر
    $sDash1.Cells.Item($r, 7).Formula = "='$mName'!J35"
    
    # الحالة والمؤشر
    $sDash1.Cells.Item($r, 8).Formula = "=IF(G$r<200, ""⚠️ عجز سيولة"", ""✅ مستقر"")"
    
    # التنسيقات
    $sDash1.Cells.Item($r, 1).HorizontalAlignment = -4108
    $sDash1.Cells.Item($r, 3).NumberFormat = "#,##0"
    $sDash1.Cells.Item($r, 4).NumberFormat = "#,##0"
    $sDash1.Cells.Item($r, 5).NumberFormat = "#,##0"
    $sDash1.Cells.Item($r, 6).NumberFormat = "#,##0"
    $sDash1.Cells.Item($r, 7).NumberFormat = "#,##0"
    $sDash1.Cells.Item($r, 8).HorizontalAlignment = -4108
}

# Totals Row (Row 17)
$rTot = 17
$sDash1.Cells.Item($rTot, 1).Value2 = "الإجمالي السنوي"
$sDash1.Cells.Item($rTot, 1).Font.Bold = $true
$sDash1.Range("A17:B17").Merge()

$sDash1.Cells.Item($rTot, 4).Formula = "=SUM(D5:D16)"
$sDash1.Cells.Item($rTot, 4).Font.Bold = $true
$sDash1.Cells.Item($rTot, 4).NumberFormat = "#,##0"

$sDash1.Cells.Item($rTot, 5).Formula = "=SUM(E5:E16)"
$sDash1.Cells.Item($rTot, 5).Font.Bold = $true
$sDash1.Cells.Item($rTot, 5).NumberFormat = "#,##0"

$sDash1.Cells.Item($rTot, 6).Formula = "=D17-E17"
$sDash1.Cells.Item($rTot, 6).Font.Bold = $true
$sDash1.Cells.Item($rTot, 6).NumberFormat = "#,##0"

$sDash1.Cells.Item($rTot, 7).Formula = "=G16"
$sDash1.Cells.Item($rTot, 7).Font.Bold = $true
$sDash1.Cells.Item($rTot, 7).NumberFormat = "#,##0"

$sDash1.Range("A4:H17").Borders.LineStyle = 1

$sDash1.Columns.Item(1).ColumnWidth = 6
$sDash1.Columns.Item(2).ColumnWidth = 16
$sDash1.Columns.Item(3).ColumnWidth = 20
$sDash1.Columns.Item(4).ColumnWidth = 24
$sDash1.Columns.Item(5).ColumnWidth = 24
$sDash1.Columns.Item(6).ColumnWidth = 22
$sDash1.Columns.Item(7).ColumnWidth = 22
$sDash1.Columns.Item(8).ColumnWidth = 22

Write-Host "✅ تم إنشاء داشبورد مجمع الشهور بنجاح!"

# -------------------------------------------------------------
# 4. إنشاء داشبورد Year To Date (YTD Executive Dashboard)
# -------------------------------------------------------------
$sDash2 = $wb.Sheets.Add([System.Type]::Missing, $wb.Sheets.Item($wb.Sheets.Count))
$sDash2.Name = "داشبورد_Year_To_Date"
$sDash2.DisplayRightToLeft = $true

$sDash2.Cells.Item(1, 1).Value2 = "📈 لوحة البيانات التنفيذية التراكمية — Year To Date (YTD Dashboard 2026)"
$sDash2.Cells.Item(1, 1).Font.Bold = $true
$sDash2.Cells.Item(1, 1).Font.Size = 16
$sDash2.Cells.Item(1, 1).Font.Color = 0x1A365D
$sDash2.Range("A1:F1").Merge()

# KPI Metric Cards Table Header
$sDash2.Cells.Item(3, 1).Value2 = "مؤشرات الأداء المالي التراكمية (YTD Financial KPIs)"
$sDash2.Cells.Item(3, 1).Font.Bold = $true
$sDash2.Cells.Item(3, 1).Font.Size = 12
$sDash2.Range("A3:D3").Merge()

$kpis = @(
    @("💰 إجمالي الإيرادات التراكمية (YTD Revenue)", "=داشبورد_مجمع_الشهور!D17"),
    @("💸 إجمالي المصروفات التراكمية (YTD Expenses)", "=داشبورد_مجمع_الشهور!E17"),
    @("⚖️ صافي أرباح / تغيير النشاط التشغيلي", "=داشبورد_مجمع_الشهور!F17"),
    @("🏦 رصيد السيولة والخزينة الحالي (Current Cash Balance)", "=داشبورد_مجمع_الشهور!G17"),
    @("📊 معدل تغطية الإيرادات للمصروفات", "=داشبورد_مجمع_الشهور!D17/داشبورد_مجمع_الشهور!E17")
)

$kHeaders = @("مؤشر الأداء المالي", "القيمة التراكمية", "الوحدة / النسبة", "حالة المؤشر")
for ($c = 0; $c -lt $kHeaders.Count; $c++) {
    $cell = $sDash2.Cells.Item(5, $c + 1)
    $cell.Value2 = $kHeaders[$c]
    $cell.Font.Bold = $true
    $cell.Font.Color = 0xFFFFFF
    $cell.Interior.Color = 0x1A365D
    $cell.HorizontalAlignment = -4108
}

$kr = 6
foreach ($kpi in $kpis) {
    $sDash2.Cells.Item($kr, 1).Value2 = $kpi[0]
    $sDash2.Cells.Item($kr, 2).Formula = $kpi[1]
    
    if ($kr -eq 10) {
        $sDash2.Cells.Item($kr, 3).Value2 = "نسبة مئوية"
        $sDash2.Cells.Item($kr, 2).NumberFormat = "0.0%"
        $sDash2.Cells.Item($kr, 4).Formula = "=IF(B10>=1, ""✅ إيجابي"", ""⚠️ مصروفات أعلى"")"
    } else {
        $sDash2.Cells.Item($kr, 3).Value2 = "جنيه مصري"
        $sDash2.Cells.Item($kr, 2).NumberFormat = "#,##0"
        $sDash2.Cells.Item($kr, 4).Formula = "=IF(B$kr>=0, ""✅ إيجابي"", ""⚠️ عجز"")"
    }
    $sDash2.Cells.Item($kr, 1).Font.Bold = $true
    $sDash2.Cells.Item($kr, 4).HorizontalAlignment = -4108
    $kr++
}

$sDash2.Range("A5:D10").Borders.LineStyle = 1

$sDash2.Columns.Item(1).ColumnWidth = 45
$sDash2.Columns.Item(2).ColumnWidth = 25
$sDash2.Columns.Item(3).ColumnWidth = 18
$sDash2.Columns.Item(4).ColumnWidth = 20

Write-Host "✅ تم إنشاء داشبورد Year To Date بنجاح!"

# -------------------------------------------------------------
# 5. حفظ الملف النهائي .xlsm
# -------------------------------------------------------------
if (Test-Path $outPath) { Remove-Item $outPath -Force }
# 52 = xlOpenXMLWorkbookMacroEnabled
$wb.SaveAs($outPath, 52)

Write-Host ""
Write-Host "===================================================="
Write-Host "🎉 اكتمل إنشاء الملف السنوي بنجاح!"
Write-Host "مسار الملف: $outPath"
Write-Host "===================================================="

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
