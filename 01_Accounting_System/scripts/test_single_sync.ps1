# test_single_sync.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

. "D:\Henu\01_Accounting_System\lib\zoho_api.ps1"

$hdrs  = Get-ZohoHeaders
$orgId = Get-OrgId

Write-Host "=== Testing Single Expense API Call ==="
Write-Host "Org ID: $orgId"

$body = @{
    date                    = (Get-Date -Format "yyyy-MM-dd")
    account_id              = "628287000000000460" # Other Expenses
    amount                  = 10
    description             = "اختبار الربط مع زوهو"
    payment_mode            = "Cash"
    paid_through_account_id = "628287000000000361" # Petty Cash
} | ConvertTo-Json -Compress

try {
    $r = Invoke-RestMethod `
        -Uri     "https://www.zohoapis.com/books/v3/expenses?organization_id=$orgId" `
        -Headers $hdrs -Method POST -Body $body -TimeoutSec 20
    Write-Host "✅ API Call SUCCESS! Created Expense ID: $($r.expense.expense_id)"
} catch {
    Write-Host "❌ API Error Details:"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.Value__)"
    Write-Host "Status Desc: $($_.Exception.Response.StatusDescription)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Raw Response Body:"
        Write-Host $_.ErrorDetails.Message
    } else {
        Write-Host "Exception Message: $($_.Exception.Message)"
    }
}
