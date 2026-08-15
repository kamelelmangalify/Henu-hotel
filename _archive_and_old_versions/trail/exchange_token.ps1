# ============================================================
# exchange_token.ps1
# يستبدل Authorization Code بـ Access + Refresh Token
# الاستخدام: .\exchange_token.ps1 -Code "الكود من URL"
# ============================================================
param(
    [string]$Code        = "",
    [string]$ConfigPath  = "D:\Henu\accountant\memory\zoho_config.json"
)

if ($Code -eq "") {
    Write-Host "❌ يجب تمرير الكود: -Code 'الكود'"
    exit 1
}

$cfg = Get-Content $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Host "🔄 جاري استبدال الكود بـ Token..."

$body = @{
    code          = $Code
    client_id     = $cfg.client_id
    client_secret = $cfg.client_secret
    redirect_uri  = $cfg.redirect_uri
    grant_type    = "authorization_code"
}

try {
    $response = Invoke-RestMethod -Uri "https://accounts.zoho.com/oauth/v2/token" `
        -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"

    if ($response.access_token) {
        $cfg.access_token  = $response.access_token
        $cfg.refresh_token = $response.refresh_token
        $cfg.token_expiry  = (Get-Date).AddSeconds(3600).ToString("yyyy-MM-dd HH:mm:ss")

        # Get Organization ID
        $headers = @{ Authorization = "Zoho-oauthtoken $($response.access_token)" }
        $orgs = Invoke-RestMethod -Uri "https://www.zohoapis.com/books/v3/organizations" -Headers $headers
        if ($orgs.organizations -and $orgs.organizations.Count -gt 0) {
            $cfg.organization_id = $orgs.organizations[0].organization_id
            Write-Host "🏢 Organization: $($orgs.organizations[0].name) (ID: $($cfg.organization_id))"
        }

        $cfg | ConvertTo-Json | Out-File $ConfigPath -Encoding UTF8
        Write-Host "✅ تم الحصول على التوكن بنجاح!"
        Write-Host "Access Token: $($response.access_token.Substring(0,20))..."
        Write-Host "Refresh Token: $($response.refresh_token.Substring(0,20))..."
        Write-Host "Organization ID: $($cfg.organization_id)"
    } else {
        Write-Host "❌ خطأ في الاستجابة:"
        $response | ConvertTo-Json
    }
} catch {
    Write-Host "❌ خطأ: $($_.Exception.Message)"
    Write-Host $_.ErrorDetails.Message
}
