# Quick Icon Test Script
# Creates simple placeholder icons for testing PWA functionality
# Replace these with proper icons from pwabuilder.com later!

Write-Host "🎨 Creating placeholder PWA icons..." -ForegroundColor Cyan
Write-Host ""

# Create icons directory
New-Item -ItemType Directory -Force -Path "public\icons" | Out-Null

# Load required assembly
Add-Type -AssemblyName System.Drawing

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$bgColor = [System.Drawing.Color]::FromArgb(59, 130, 246)  # Blue #3b82f6

foreach ($size in $sizes) {
    try {
        $bmp = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($bmp)
        
        # Fill background
        $graphics.Clear($bgColor)
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        
        # Add musical note symbol
        $fontSize = [int]($size * 0.5)
        $font = New-Object System.Drawing.Font("Segoe UI Emoji", $fontSize, [System.Drawing.FontStyle]::Regular)
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $text = "🎵"
        
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
        
        $rectF = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
        $graphics.DrawString($text, $font, $brush, $rectF, $sf)
        
        # Save
        $filename = "public\icons\icon-$($size)x$($size).png"
        $bmp.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
        
        Write-Host "✅ Created: icon-$($size)x$($size).png" -ForegroundColor Green
        
        # Cleanup
        $graphics.Dispose()
        $bmp.Dispose()
        $font.Dispose()
        $brush.Dispose()
    }
    catch {
        Write-Host "⚠️  Could not create icon-$($size)x$($size).png" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✨ Placeholder icons created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: These are temporary placeholders!" -ForegroundColor Yellow
Write-Host "   Replace with professional icons from:" -ForegroundColor Gray
Write-Host "   https://www.pwabuilder.com/imageGenerator" -ForegroundColor Cyan
Write-Host ""
