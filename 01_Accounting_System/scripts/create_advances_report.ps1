# create_advances_report.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$outFile = "D:\Henu\تفاصيل_سلف_الموظفين.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Add()

# -------------------------------------------------------------
# Sheet 1: ملخص سلف الموظفين
# -------------------------------------------------------------
$sSummary = $wb.Sheets.Item(1)
$sSummary.Name = "ملخص سلف الموظفين"
$sSummary.DisplayRightToLeft = $true

# Title
$sSummary.Cells.Item(1, 1).Value2 = "هوستل الأهرامات — ملخص وتجميع سلف الموظفين"
$sSummary.Cells.Item(1, 1).Font.Bold = $true
$sSummary.Cells.Item(1, 1).Font.Size = 16
$sSummary.Cells.Item(1, 1).Font.Color = 0x5D361A
$sSummary.Range("A1:D1").Merge()

$sSummary.Cells.Item(2, 1).Value2 = "تاريخ التقرير: 31 أغسطس 2026 | المصدر: سجل الإيرادات والمصروفات"
$sSummary.Cells.Item(2, 1).Font.Italic = $true
$sSummary.Cells.Item(2, 1).Font.Size = 10
$sSummary.Range("A2:D2").Merge()

# Table Headers
$headers = @("م", "اسم الموظف", "عدد السلف", "إجمالي قيمة السلف (ج)")
for ($i = 0; $i -lt $headers.Count; $i++) {
    $c = $sSummary.Cells.Item(4, $i + 1)
    $c.Value2 = $headers[$i]
    $c.Font.Bold = $true
    $c.Font.Color = 0xFFFFFF
    $c.Interior.Color = 0x966C2B
    $c.HorizontalAlignment = -4108
}

# Data rows
$summaryData = @(
    @("1", "أحمد البار", "1", "2500"),
    @("2", "أستاذ خالد", "2", "2500"),
    @("3", "محمد المنسي", "2", "1200"),
    @("4", "يوسف", "6", "1050"),
    @("5", "جومانة وجيه", "2", "1050"),
    @("6", "مدحت", "2", "1000"),
    @("7", "منة", "1", "200")
)

$r = 5
foreach ($row in $summaryData) {
    $sSummary.Cells.Item($r, 1).Value2 = [string]$row[0]
    $sSummary.Cells.Item($r, 2).Value2 = [string]$row[1]
    $sSummary.Cells.Item($r, 3).Value2 = [double]$row[2]
    $sSummary.Cells.Item($r, 4).Value2 = [double]$row[3]

    $sSummary.Cells.Item($r, 1).HorizontalAlignment = -4108
    $sSummary.Cells.Item($r, 3).HorizontalAlignment = -4108
    $sSummary.Cells.Item($r, 4).NumberFormat = "#,##0"
    $r++
}

# Totals Row
$sSummary.Cells.Item($r, 1).Value2 = "الإجمالي"
$sSummary.Cells.Item($r, 1).Font.Bold = $true
$sSummary.Range("A$r:B$r").Merge()
$sSummary.Cells.Item($r, 3).Formula = "=SUM(C5:C$($r-1))"
$sSummary.Cells.Item($r, 3).Font.Bold = $true
$sSummary.Cells.Item($r, 3).HorizontalAlignment = -4108

$sSummary.Cells.Item($r, 4).Formula = "=SUM(D5:D$($r-1))"
$sSummary.Cells.Item($r, 4).Font.Bold = $true
$sSummary.Cells.Item($r, 4).NumberFormat = "#,##0"

# Format Summary Table Borders
$rangeSummary = $sSummary.Range("A4:D$r")
$rangeSummary.Borders.LineStyle = 1

# Column Widths
$sSummary.Columns.Item(1).ColumnWidth = 8
$sSummary.Columns.Item(2).ColumnWidth = 25
$sSummary.Columns.Item(3).ColumnWidth = 15
$sSummary.Columns.Item(4).ColumnWidth = 25

# -------------------------------------------------------------
# Sheet 2: تفاصيل قيود السلف
# -------------------------------------------------------------
$sDetail = $wb.Sheets.Add([System.Type]::Missing, $sSummary)
$sDetail.Name = "تفاصيل قيود السلف"
$sDetail.DisplayRightToLeft = $true

$sDetail.Cells.Item(1, 1).Value2 = "تفاصيل جميع قيود سلف الموظفين بالتواريخ والملاحظات"
$sDetail.Cells.Item(1, 1).Font.Bold = $true
$sDetail.Cells.Item(1, 1).Font.Size = 14
$sDetail.Range("A1:G1").Merge()

$dHeaders = @("م", "اسم الموظف", "التاريخ", "بيان القيد", "المبلغ (ج)", "مصدر الشيت", "ملاحظات")
for ($i = 0; $i -lt $dHeaders.Count; $i++) {
    $c = $sDetail.Cells.Item(3, $i + 1)
    $c.Value2 = $dHeaders[$i]
    $c.Font.Bold = $true
    $c.Font.Color = 0xFFFFFF
    $c.Interior.Color = 0x2E5B1A
    $c.HorizontalAlignment = -4108
}

$detailsData = @(
    @("1", "أحمد البار", "8/4/2026", "سلفة ل احمد البار من مرتب شهر", "2500", "1-A Petty Cash", ""),
    @("2", "يوسف", "8/7/2026", "سلفة من الراتب للموظف يوسف", "200", "1-A Petty Cash", ""),
    @("3", "يوسف", "8/11/2026", "سلفة للموظف يوسف", "100", "Sheet1", ""),
    @("4", "يوسف", "8/12/2026", "سلفة للموظف يوسف", "200", "Sheet1", ""),
    @("5", "جومانة وجيه", "8/17/2026", "سلفة ل جومانة وجيه من الراتب", "1000", "1-B Petty Cash", ""),
    @("6", "مدحت", "8/17/2026", "سلفة  ل مدحت من الراتب", "500", "1-B Petty Cash", ""),
    @("7", "يوسف", "8/19/2026", "سلفة من راتب يوسف", "200", "1-B Petty Cash", ""),
    @("8", "يوسف", "8/21/2026", "سلفة من الراتب ل يوسف", "200", "Sheet2", ""),
    @("9", "جومانة وجيه", "8/21/2026", "سلفة من الراتب ل جومانة", "50", "Sheet2", ""),
    @("10", "أستاذ خالد", "8/23/2026", "سلفة استاذ خالد", "1000", "Sheet2", ""),
    @("11", "محمد المنسي", "8/24/2026", "سلفة من الراتب محمد المنسي", "1000", "Sheet2", ""),
    @("12", "مدحت", "8/24/2026", "سلفة من الراتب مدحت", "500", "Sheet2", ""),
    @("13", "أستاذ خالد", "8/25/2026", "سلفة لخالد", "1500", "Sheet3", ""),
    @("14", "منة", "8/25/2026", "سلفة ل منة", "200", "Sheet3", ""),
    @("15", "يوسف", "8/25/2026", "سلفة ل يوسف", "150", "Sheet3", ""),
    @("16", "محمد المنسي", "8/25/2026", "سلفة من الراتب محمد منسي", "200", "Sheet3", "")
)

$dr = 4
foreach ($row in $detailsData) {
    $sDetail.Cells.Item($dr, 1).Value2 = [string]$row[0]
    $sDetail.Cells.Item($dr, 2).Value2 = [string]$row[1]
    $sDetail.Cells.Item($dr, 3).Value2 = [string]$row[2]
    $sDetail.Cells.Item($dr, 4).Value2 = [string]$row[3]
    $sDetail.Cells.Item($dr, 5).Value2 = [double]$row[4]
    $sDetail.Cells.Item($dr, 6).Value2 = [string]$row[5]
    $sDetail.Cells.Item($dr, 7).Value2 = [string]$row[6]

    $sDetail.Cells.Item($dr, 1).HorizontalAlignment = -4108
    $sDetail.Cells.Item($dr, 3).HorizontalAlignment = -4108
    $sDetail.Cells.Item($dr, 5).NumberFormat = "#,##0"
    $sDetail.Cells.Item($dr, 6).HorizontalAlignment = -4108
    $dr++
}

# Totals Row in Details
$sDetail.Cells.Item($dr, 1).Value2 = "الإجمالي"
$sDetail.Cells.Item($dr, 1).Font.Bold = $true
$sDetail.Range("A$dr:D$dr").Merge()

$sDetail.Cells.Item($dr, 5).Formula = "=SUM(E4:E$($dr-1))"
$sDetail.Cells.Item($dr, 5).Font.Bold = $true
$sDetail.Cells.Item($dr, 5).NumberFormat = "#,##0"

# Format Details Table Borders
$rangeDetails = $sDetail.Range("A3:G$dr")
$rangeDetails.Borders.LineStyle = 1

# Column Widths
$sDetail.Columns.Item(1).ColumnWidth = 8
$sDetail.Columns.Item(2).ColumnWidth = 20
$sDetail.Columns.Item(3).ColumnWidth = 14
$sDetail.Columns.Item(4).ColumnWidth = 35
$sDetail.Columns.Item(5).ColumnWidth = 18
$sDetail.Columns.Item(6).ColumnWidth = 18
$sDetail.Columns.Item(7).ColumnWidth = 25

# Save
if (Test-Path $outFile) { Remove-Item $outFile -Force }
$wb.SaveAs($outFile)
$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "✅ تم إنشاء التقرير بنجاح وبدون أي أخطاء: $outFile"
