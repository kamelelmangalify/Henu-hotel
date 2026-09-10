# fix_vba_buttons.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$outPath = "D:\Henu\سجل_الإيرادات_والمصروفات_السنوي_2026.xlsm"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

Write-Host "════════════════════════════════════════════════════"
Write-Host "  🔧 إصلاح الماكرو وإضافة زرين (أعلى وأسفل الشيت)..."
Write-Host "════════════════════════════════════════════════════"

$wb = $excel.Workbooks.Open((Resolve-Path $outPath).Path)

# 1. تحديث الماكرو في Module1
$vbProj = $wb.VBProject
foreach ($comp in $vbProj.VBComponents) {
    if ($comp.Type -eq 1) { # Standard Module
        $comp.CodeModule.DeleteLines(1, $comp.CodeModule.CountOfLines)
    }
}

$vbModule = $vbProj.VBComponents.Add(1)
$vbaCode = @"
Public Sub AddNewRowToCurrentSheet()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    Application.EnableEvents = False
    
    Dim lastRow As Long
    Dim r As Long
    lastRow = 0
    
    ' البحث عن صف الإجمالي
    For r = 1 To 1000
        Dim cellVal As String
        cellVal = Trim(CStr(ws.Cells(r, 1).Value))
        If cellVal = "الاجمالي" Or cellVal = "الإجمالي" Or cellVal = "إجمالي" Then
            lastRow = r
            Exit For
        End If
    Next r
    
    If lastRow = 0 Then
        For r = 1 To 1000
            cellVal = Trim(CStr(ws.Cells(r, 5).Value))
            If cellVal = "الاجمالي" Or cellVal = "الإجمالي" Or cellVal = "إجمالي" Then
                lastRow = r
                Exit For
            End If
        Next r
    End If
    
    If lastRow = 0 Then
        MsgBox "لم يتم العثور على صف الإجمالي في هذا الشيت.", vbExclamation, "تنبيه"
        GoTo CleanUp
    End If
    
    ' إدراج صف جديد فوق صف الإجمالي
    ' Shift:=-4121 (xlDown), CopyOrigin:=0 (xlFormatFromLeftOrAbove)
    ws.Rows(lastRow).Insert Shift:=-4121, CopyOrigin:=0
    
    Dim newRow As Long
    newRow = lastRow
    Dim prevRow As Long
    prevRow = newRow - 1
    
    ' تطبيق التنسيقات والصيغ
    ws.Cells(newRow, 10).Formula = "=J" & prevRow & "-G" & newRow & "+H" & newRow
    ws.Cells(newRow, 11).Formula = "=IF(J" & newRow & "<200,""تنبيه: أعد التعبئة"",""مقبول"")"
    
    ' تحديث معادلة المجموع في صف الإجمالي الجديد
    Dim totalRow As Long
    totalRow = lastRow + 1
    ws.Cells(totalRow, 7).Formula = "=SUM(G4:G" & newRow & ")"
    ws.Cells(totalRow, 8).Formula = "=SUM(H4:H" & newRow & ")"
    
    If Application.Visible Then
        On Error Resume Next
        ws.Cells(newRow, 5).Select
        On Error GoTo ErrorHandler
    End If

CleanUp:
    Application.EnableEvents = True
    Application.ScreenUpdating = True
    Exit Sub

ErrorHandler:
    Application.EnableEvents = True
    Application.ScreenUpdating = True
    MsgBox "حدث خطأ أثناء إضافة الصف: " & Err.Description, vbCritical, "خطأ"
End Sub
"@
$vbModule.CodeModule.AddFromString($vbaCode)
Write-Host "✅ تم تحديث كود الماكرو 'AddNewRowToCurrentSheet' بأمان"

# أسماء الشهور الـ 12
$months = @(
    "01-يناير", "02-فبراير", "03-مارس", "04-أبريل",
    "05-مايو", "06-يونيو", "07-يوليو", "08-أغسطس",
    "09-سبتمبر", "10-أكتوبر", "11-نوفمبر", "12-ديسمبر"
)

# 2. تحديث وإضافة الأزرار في أعلى وأسفل كل شيت
foreach ($mName in $months) {
    $sheet = $wb.Sheets.Item($mName)
    
    # حذف الأزرار القديمة
    while ($sheet.Buttons().Count -gt 0) {
        $sheet.Buttons(1).Delete()
    }
    
    # الزر العلوي (Top Button)
    $btnTop = $sheet.Buttons().Add(480, 4, 150, 26)
    $btnTop.Caption = "➕ إضافة صف جديد"
    $btnTop.OnAction = "AddNewRowToCurrentSheet"
    $btnTop.Font.Name = "Segoe UI"
    $btnTop.Font.Bold = $true
    $btnTop.Font.Size = 10
    
    # الزر السفلي (Bottom Button عند صف الإجمالي)
    $btnBottom = $sheet.Buttons().Add(480, 715, 150, 26)
    $btnBottom.Caption = "➕ إضافة صف جديد"
    $btnBottom.OnAction = "AddNewRowToCurrentSheet"
    $btnBottom.Font.Name = "Segoe UI"
    $btnBottom.Font.Bold = $true
    $btnBottom.Font.Size = 10
    
    Write-Host "  ✅ شيت '$mName': تم إضافة الزر العلوي والزر السفلي بنجاح!"
}

# حفظ الملف .xlsm
$wb.Save()
Write-Host ""
Write-Host "===================================================="
Write-Host "🎉 تم حفظ إصلاح الأزرار والماكرو بنجاح!"
Write-Host "===================================================="

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
