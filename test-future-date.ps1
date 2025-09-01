# Test script to verify future date validation

Write-Host "Testing future date validation..." -ForegroundColor Green

# Test 1: Try to add chant with future date
$futureDate = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$today = (Get-Date).ToString("yyyy-MM-dd")

Write-Host "Today: $today" -ForegroundColor Yellow
Write-Host "Future date to test: $futureDate" -ForegroundColor Yellow

# Create test data with future date
$testData = @{
    userid = "testuser123"
    date = $futureDate
    count = 5
} | ConvertTo-Json -Compress

Write-Host "Test data: $testData" -ForegroundColor Cyan

try {
    # Test with future date (should fail)
    Write-Host "`nTesting with future date (should be rejected)..." -ForegroundColor Red
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/chants/add" -Method POST -Body $testData -ContentType "application/json"
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "Error (expected): $($_.Exception.Message)" -ForegroundColor Red
}

# Test with today's date (should succeed)
$testDataToday = @{
    userid = "testuser123"
    date = $today
    count = 5
} | ConvertTo-Json -Compress

try {
    Write-Host "`nTesting with today's date (should succeed)..." -ForegroundColor Green
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/chants/add" -Method POST -Body $testDataToday -ContentType "application/json"
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Green
