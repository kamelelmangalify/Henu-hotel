$cfg = Get-Content "D:\Henu\accountant\memory\zoho_config.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$token = $cfg.access_token
$orgId = $cfg.organization_id
$headers = @{ Authorization = "Zoho-oauthtoken $token"; "Content-Type" = "application/json" }

Write-Host "Fetching chart of accounts..."
try {
    $resp = Invoke-RestMethod -Uri "https://www.zohoapis.com/books/v3/chartofaccounts?organization_id=$orgId&account_type=expense&filter_by=AccountType.Expense" -Method GET -Headers $headers
    Write-Host "Total accounts: $($resp.chartofaccounts.Count)"
    foreach ($acc in $resp.chartofaccounts) {
        Write-Host "$($acc.account_name) | type=$($acc.account_type)"
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}