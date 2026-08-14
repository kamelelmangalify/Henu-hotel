$cfg = Get-Content "D:\Henu\accountant\memory\zoho_config.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$token = $cfg.access_token
$headers = @{ Authorization = "Zoho-oauthtoken $token" }
Write-Host "org_id from config: $($cfg.organization_id)"
$resp = Invoke-RestMethod -Uri "https://www.zohoapis.com/books/v3/organizations" -Method GET -Headers $headers
foreach ($org in $resp.organizations) {
    Write-Host "Org: $($org.name) | ID: $($org.organization_id) | Active: $($org.is_default_org)"
}