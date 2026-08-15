$cfg = Get-Content "D:\Henu\accountant\memory\zoho_config.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$token = $cfg.access_token
$orgId = $cfg.organization_id
$headers = @{ Authorization = "Zoho-oauthtoken $token"; "Content-Type" = "application/json" }

$payload = @{
    date         = "2026-08-06"
    amount       = 300
    account_name = "Salaries and Employee Wages"
    description  = "سلفة للموظف يوسف"
    payment_mode = "Cash"
} | ConvertTo-Json

Write-Host "Sending expense to Zoho..."
try {
    $resp = Invoke-RestMethod -Uri "https://www.zohoapis.com/books/v3/expenses?organization_id=$orgId" -Method POST -Headers $headers -Body $payload
    Write-Host "code: $($resp.code)"
    Write-Host "message: $($resp.message)"
    if ($resp.code -eq 0) {
        Write-Host "SUCCESS: Expense ID = $($resp.expense.expense_id)"
        # Update ledger with zoho_id
        $ledger = Get-Content "D:\Henu\accountant\memory\ledger.json" -Raw -Encoding UTF8 | ConvertFrom-Json
        $tx = $ledger.transactions | Where-Object { $_.description -eq "سلفة للموظف يوسف" -and -not $_.zoho_id }
        if ($tx) {
            $tx | Add-Member -NotePropertyName "zoho_id" -NotePropertyValue $resp.expense.expense_id -Force
            $tx | Add-Member -NotePropertyName "zoho_synced_at" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd HH:mm:ss") -Force
            $ledger | ConvertTo-Json -Depth 10 | Out-File "D:\Henu\accountant\memory\ledger.json" -Encoding UTF8
            Write-Host "Ledger updated with zoho_id"
        }
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    try {
        $sr = $_.Exception.Response.GetResponseStream()
        $rd = New-Object System.IO.StreamReader($sr)
        Write-Host "Response Body: $($rd.ReadToEnd())"
    } catch {}
}