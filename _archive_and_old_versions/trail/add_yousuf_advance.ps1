$cfg = Get-Content "D:\Henu\accountant\memory\zoho_config.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Refresh token if needed
$expiry = [datetime]::Parse($cfg.token_expiry)
if ((Get-Date) -gt $expiry.AddMinutes(-5)) {
    Write-Host "Refreshing token..."
    $body = "refresh_token=$($cfg.refresh_token)&client_id=$($cfg.client_id)&client_secret=$($cfg.client_secret)&grant_type=refresh_token"
    $resp = Invoke-RestMethod -Uri "https://accounts.zoho.com/oauth/v2/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    $cfg.access_token = $resp.access_token
    $cfg.token_expiry = (Get-Date).AddSeconds(3600).ToString("yyyy-MM-dd HH:mm:ss")
    $cfg | ConvertTo-Json | Out-File "D:\Henu\accountant\memory\zoho_config.json" -Encoding UTF8
}

$token   = $cfg.access_token
$orgId   = $cfg.organization_id
$baseUrl = "https://www.zohoapis.com/books/v3"
$headers = @{ Authorization = "Zoho-oauthtoken $token"; "Content-Type" = "application/json" }

$payload = @{
    date         = "2026-08-06"
    amount       = 300
    account_name = "Salaries and Employee Wages"
    description  = "سلفة للموظف يوسف"
    payment_mode = "Cash"
} | ConvertTo-Json

Write-Host "Uploading expense to Zoho..."
$resp = Invoke-RestMethod -Uri "${baseUrl}/expenses?organization_id=${orgId}" -Method POST -Headers $headers -Body $payload

Write-Host "code=$($resp.code) | message=$($resp.message)"
if ($resp.code -eq 0) {
    $eid = $resp.expense.expense_id
    Write-Host "OK! Expense ID = $eid"
    # Update ledger
    $ledger = Get-Content "D:\Henu\accountant\memory\ledger.json" -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($tx in $ledger.transactions) {
        if ($tx.description -eq "سلفة للموظف يوسف" -and (-not $tx.PSObject.Properties["zoho_id"] -or $tx.zoho_id -eq $null -or $tx.zoho_id -eq "")) {
            $tx | Add-Member -NotePropertyName "zoho_id" -NotePropertyValue $eid -Force
            $tx | Add-Member -NotePropertyName "zoho_synced_at" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd HH:mm:ss") -Force
            Write-Host "Ledger updated!"
            break
        }
    }
    $ledger | ConvertTo-Json -Depth 10 | Out-File "D:\Henu\accountant\memory\ledger.json" -Encoding UTF8
} else {
    Write-Host "FAILED: $($resp.message)"
}