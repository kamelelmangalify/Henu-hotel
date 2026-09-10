# check_zoho_orgs.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

. "D:\Henu\01_Accounting_System\lib\zoho_api.ps1"

$hdrs = Get-ZohoHeaders
$cfg  = Get-ZohoConfig

Write-Host "=== Zoho Configuration ==="
Write-Host "Config Path : $SCRIPT:ConfigPath"
Write-Host "Org ID      : $($cfg.organization_id)"
Write-Host "Data Center : $($cfg.data_center)"
Write-Host "Scopes      : $($cfg.scopes)"

Write-Host ""
Write-Host "=== Fetching Zoho Organizations List ==="

try {
    $r = Invoke-RestMethod -Uri "https://www.zohoapis.com/books/v3/organizations" -Headers $hdrs -Method GET -TimeoutSec 15
    Write-Host "Found $($r.organizations.Count) Organization(s):"
    foreach ($org in $r.organizations) {
        Write-Host " - Org Name : $($org.name)"
        Write-Host "   Org ID   : $($org.organization_id)"
        Write-Host "   Status   : $($org.status)"
        Write-Host "   Plan     : $($org.plan_type) | Account Created: $($org.created_time)"
        Write-Host "   Currency : $($org.currency_code)"
        Write-Host "------------------------------------------"
    }
} catch {
    Write-Host "❌ Error fetching organizations: $($_.Exception.Message)"
}
