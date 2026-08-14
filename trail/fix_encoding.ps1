
# fix_encoding.ps1 — يعيد حفظ السكريبتات بترميز UTF-8 BOM
$scriptsDir = "D:\Henu\accountant\scripts"
$files = @("import_from_excel.ps1","add_transaction.ps1","generate_daily_report.ps1","review_entries.ps1","import_hostel_temp.ps1","direct_import_hostel.ps1")
foreach ($f in $files) {
    $path = Join-Path $scriptsDir $f
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $utf8Bom = New-Object System.Text.UTF8Encoding $true
    [System.IO.File]::WriteAllText($path, $content, $utf8Bom)
    Write-Host "✅ Resaved: $f"
}
Write-Host "Done."
