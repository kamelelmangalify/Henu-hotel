# generate_pdf.ps1
# This script converts the HTML file to PDF using Microsoft Edge in headless mode.

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$htmlPath = (Get-Item (Join-Path $PSScriptRoot "*.html")).FullName
$pdfPath = $htmlPath.Replace(".html", ".pdf")

if (-not (Test-Path $edgePath)) {
    Write-Error "Microsoft Edge was not found at $edgePath"
    exit 1
}

if (-not (Test-Path $htmlPath)) {
    Write-Error "HTML file was not found at $htmlPath"
    exit 1
}

Write-Host "Converting HTML to PDF using MS Edge..."
$args = @(
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--print-to-pdf=$pdfPath",
    $htmlPath
)

$process = Start-Process -FilePath $edgePath -ArgumentList $args -PassThru -Wait

if ($process.ExitCode -eq 0 -and (Test-Path $pdfPath)) {
    Write-Host "✅ Successfully generated PDF at: $pdfPath"
} else {
    Write-Error "❌ Failed to generate PDF. Exit code: $($process.ExitCode)"
    exit 1
}
