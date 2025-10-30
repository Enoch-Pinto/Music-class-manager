# Firebase & PWA Setup Script for Windows PowerShell
# Run this script to install all dependencies and set up the project

Write-Host "🎵 Music Class Manager - Firebase & PWA Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install firebase next-pwa --legacy-peer-deps

Write-Host "✅ Dependencies installed!" -ForegroundColor Green
Write-Host ""

# Step 2: Create .env.local if it doesn't exist
Write-Host "⚙️ Step 2: Setting up environment file..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "✅ Created .env.local from template" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit .env.local with your Firebase credentials!" -ForegroundColor Red
} else {
    Write-Host "ℹ️  .env.local already exists, skipping..." -ForegroundColor Blue
}
Write-Host ""

# Step 3: Create icons directory
Write-Host "🎨 Step 3: Creating icons directory..." -ForegroundColor Yellow
if (!(Test-Path "public\icons")) {
    New-Item -ItemType Directory -Path "public\icons" -Force | Out-Null
    Write-Host "✅ Created public/icons/ directory" -ForegroundColor Green
    Write-Host "⚠️  TODO: Add PWA icons to public/icons/" -ForegroundColor Red
    Write-Host "   Use: https://www.pwabuilder.com/imageGenerator" -ForegroundColor Gray
} else {
    Write-Host "ℹ️  Icons directory already exists" -ForegroundColor Blue
}
Write-Host ""

# Step 4: Display next steps
Write-Host "✨ Setup Complete! Next Steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣  Create Firebase Project:" -ForegroundColor Cyan
Write-Host "   - Go to: https://console.firebase.google.com/" -ForegroundColor Gray
Write-Host "   - Create new project" -ForegroundColor Gray
Write-Host "   - Enable Authentication (Email/Password)" -ForegroundColor Gray
Write-Host "   - Create Firestore Database" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Update .env.local with Firebase config" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣  Generate PWA icons:" -ForegroundColor Cyan
Write-Host "   - Visit: https://www.pwabuilder.com/imageGenerator" -ForegroundColor Gray
Write-Host "   - Upload your logo" -ForegroundColor Gray
Write-Host "   - Download and place in public/icons/" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Run the development server:" -ForegroundColor Cyan
Write-Host "   pnpm dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - SETUP_GUIDE.md (Complete guide)" -ForegroundColor Gray
Write-Host "   - README_FIREBASE_PWA.md (Quick start)" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Magenta
