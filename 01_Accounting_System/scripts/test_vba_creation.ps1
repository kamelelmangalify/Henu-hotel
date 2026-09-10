# test_vba_creation.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Add()

try {
    # إضافة ماكرو في الموديول
    $vbModule = $wb.VBProject.VBComponents.Add(1) # 1 = vbext_ct_StdModule
    $vbaCode = @"
Sub AddNewRowToCurrentSheet()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    Dim lastRow As Long
    Dim r As Long
    
    ' البحث عن صف الإجمالي
    For r = 1 To 500
        If Trim(ws.Cells(r, 1).Value) = "الاجمالي" Then
            lastRow = r
            Exit For
        End If
    Next r
    
    If lastRow = 0 Then
        MsgBox "لم يتم العثور على صف الإجمالي", vbExclamation, "تنبيه"
        Exit Sub
    End If
    
    ' إدراج صف جديد فوق صف الإجمالي
    ws.Rows(lastRow).Insert Shift:=xlDown, CopyOrigin:=xlFormatFromLeftOrAbove
    
    Dim newRow As Long
    newRow = lastRow
    Dim prevRow As Long
    prevRow = newRow - 1
    
    ' وضع صيغ الرصيد المتبقي والتنبيه
    ws.Cells(newRow, 10).Formula = "=J" & prevRow & "-G" & newRow & "+H" & newRow
    ws.Cells(newRow, 11).Formula = "=IF(J" & newRow & "<200,""تنبيه: أعد التعبئة"",""مقبول"")"
    
    ' تحديث صف الإجمالي الجديد (lastRow + 1)
    Dim totalRow As Long
    totalRow = lastRow + 1
    ws.Cells(totalRow, 7).Formula = "=SUM(G4:G" & newRow & ")"
    ws.Cells(totalRow, 8).Formula = "=SUM(H4:H" & newRow & ")"
    
    ws.Cells(newRow, 5).Select
    MsgBox "تم إضافة صف جديد بنجاح وتحديث الصيغ والمجاميع!", vbInformation, "نجاح"
End Sub
"@
    $vbModule.CodeModule.AddFromString($vbaCode)
    Write-Host "✅ VBA Module added successfully!"

    # إضافة زر Form Control في الشيت
    $sheet = $wb.Sheets.Item(1)
    $btn = $sheet.Buttons().Add(450, 10, 140, 30)
    $btn.Caption = "➕ إضافة صف جديد"
    $btn.OnAction = "AddNewRowToCurrentSheet"
    $btn.Font.Name = "Cairo"
    $btn.Font.Bold = $true
    $btn.Font.Size = 11
    
    Write-Host "✅ Button added successfully!"

    $testPath = "D:\Henu\test_vba.xlsm"
    if (Test-Path $testPath) { Remove-Item $testPath -Force }
    # 52 = xlOpenXMLWorkbookMacroEnabled (.xlsm)
    $wb.SaveAs($testPath, 52)
    Write-Host "✅ File saved successfully as .xlsm!"

} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
