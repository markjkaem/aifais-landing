$body = @{
    companyName = "Test Company"
    clientName = "Test Client"
    projectTitle = "Test Project"
    items = @(
        @{
            description = "Test Item"
            quantity = 1
            price = 100
        }
    )
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/finance/generate-quote" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 30
    Write-Host "Status:" $response.StatusCode
    $result = $response.Content | ConvertFrom-Json
    Write-Host "Success:" $result.success
    if ($result.data.pdfBase64) {
        Write-Host "PDF Generated: Yes"
        Write-Host "PDF Size:" ([System.Convert]::FromBase64String($result.data.pdfBase64).Length / 1024).ToString("F2") "KB"
    }
} catch {
    Write-Host "Error:" $_.Exception.Message
    Write-Host $_.Exception
}
