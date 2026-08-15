$cfg = Get-Content "D:\Henu\accountant\memory\zoho_config.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$token = $cfg.access_token
$orgId = $cfg.organization_id
$headers = @{ Authorization = "Zoho-oauthtoken $token"; "Content-Type" = "application/json" }

$url = "https://www.zohoapis.com/books/v3/expenses?organization_id=$orgId"
Write-Host "URL: $url"

$body = '{"date":"2026-08-06","amount":300,"account_name":"Salaries and Employee Wages","description":"سلفة للموظف يوسف","payment_mode":"Cash"}'

try {
    $resp = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    Write-Host "SUCCESS code=$($resp.code) expense_id=$($resp.expense.expense_id)"
    # update ledger
    $ledger = Get-Content "D:\Henu\accountant\memory\ledger.json" -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($tx in $ledger.transactions) {
        if ($tx.description -eq "سلفة للموظف يوسف" -and (-not $tx.PSObject.Properties["zoho_id"] -or [string]::IsNullOrEmpty($tx.zoho_id))) {
            $tx | Add-Member -NotePropertyName "zoho_id" -NotePropertyValue $resp.expense.expense_id -Force
            $tx | Add-Member -NotePropertyName "zoho_synced_at" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd HH:mm:ss") -Force
            break
        }
    }
    $ledger | ConvertTo-Json -Depth 10 | Out-File "D:\Henu\accountant\memory\ledger.json" -Encoding UTF8
    Write-Host "Ledger updated!"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    $sr = $_.Exception.Response.GetResponseStream()
    $rd = New-Object System.IO.StreamReader($sr)
    Write-Host "Body: $($rd.ReadToEnd())"
}