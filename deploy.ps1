# PlayLearn - Quick Deployment Script
# This script helps you deploy to various platforms

Write-Host "🚀 PlayLearn Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose deployment platform:" -ForegroundColor Yellow
Write-Host "1. GitHub Pages (Free, Simple)"
Write-Host "2. Netlify (Recommended)"
Write-Host "3. Vercel (Fast)"
Write-Host "4. Firebase Hosting"
Write-Host "5. Check if ready to deploy"
Write-Host ""

$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n📦 Deploying to GitHub Pages..." -ForegroundColor Green
        Write-Host "Make sure you have a GitHub repository set up!" -ForegroundColor Yellow
        Write-Host ""
        
        $confirm = Read-Host "Have you created a GitHub repo? (y/n)"
        if ($confirm -eq "y") {
            Write-Host "`nRunning git commands..." -ForegroundColor Cyan
            git add .
            $message = Read-Host "Enter commit message (or press Enter for default)"
            if ([string]::IsNullOrWhiteSpace($message)) {
                $message = "Deploy PlayLearn app"
            }
            git commit -m $message
            git push origin main
            
            Write-Host "`n✅ Pushed to GitHub!" -ForegroundColor Green
            Write-Host "Now go to GitHub → Settings → Pages to enable GitHub Pages" -ForegroundColor Yellow
        } else {
            Write-Host "`nFirst create a repo at: https://github.com/new" -ForegroundColor Yellow
        }
    }
    
    "2" {
        Write-Host "`n📦 Deploying to Netlify..." -ForegroundColor Green
        
        # Check if Netlify CLI is installed
        $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
        
        if ($netlifyInstalled) {
            Write-Host "Netlify CLI found!" -ForegroundColor Green
            netlify deploy --prod
        } else {
            Write-Host "Netlify CLI not installed." -ForegroundColor Yellow
            Write-Host "`nOption 1: Install CLI and deploy"
            Write-Host "  npm install -g netlify-cli"
            Write-Host "  netlify login"
            Write-Host "  netlify deploy --prod"
            Write-Host ""
            Write-Host "Option 2: Drag & Drop (Easiest!)" -ForegroundColor Cyan
            Write-Host "  1. Go to: https://app.netlify.com/drop"
            Write-Host "  2. Drag this folder: $PWD"
            Write-Host "  3. Done!"
        }
    }
    
    "3" {
        Write-Host "`n📦 Deploying to Vercel..." -ForegroundColor Green
        
        # Check if Vercel CLI is installed
        $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
        
        if ($vercelInstalled) {
            Write-Host "Vercel CLI found!" -ForegroundColor Green
            vercel --prod
        } else {
            Write-Host "Vercel CLI not installed." -ForegroundColor Yellow
            Write-Host "`nInstall and deploy:"
            Write-Host "  npm install -g vercel"
            Write-Host "  vercel login"
            Write-Host "  vercel --prod"
        }
    }
    
    "4" {
        Write-Host "`n📦 Deploying to Firebase..." -ForegroundColor Green
        
        # Check if Firebase CLI is installed
        $firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
        
        if ($firebaseInstalled) {
            Write-Host "Firebase CLI found!" -ForegroundColor Green
            firebase deploy
        } else {
            Write-Host "Firebase CLI not installed." -ForegroundColor Yellow
            Write-Host "`nInstall and deploy:"
            Write-Host "  npm install -g firebase-tools"
            Write-Host "  firebase login"
            Write-Host "  firebase init hosting"
            Write-Host "  firebase deploy"
        }
    }
    
    "5" {
        Write-Host "`n🔍 Checking deployment readiness..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check for required files
        $requiredFiles = @("index.html", "age-selection.html", "game-hub.html")
        $allPresent = $true
        
        foreach ($file in $requiredFiles) {
            if (Test-Path $file) {
                Write-Host "✅ $file found" -ForegroundColor Green
            } else {
                Write-Host "❌ $file missing" -ForegroundColor Red
                $allPresent = $false
            }
        }
        
        # Check for config files
        Write-Host ""
        Write-Host "Configuration files:" -ForegroundColor Yellow
        if (Test-Path "netlify.toml") {
            Write-Host "✅ netlify.toml (for Netlify)" -ForegroundColor Green
        }
        if (Test-Path "vercel.json") {
            Write-Host "✅ vercel.json (for Vercel)" -ForegroundColor Green
        }
        if (Test-Path "firebase.json") {
            Write-Host "✅ firebase.json (for Firebase)" -ForegroundColor Green
        }
        
        Write-Host ""
        if ($allPresent) {
            Write-Host "🎉 Your app is ready to deploy!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Some files are missing. Check above." -ForegroundColor Yellow
        }
        
        # Check git status
        Write-Host ""
        Write-Host "Git status:" -ForegroundColor Yellow
        git status --short
    }
    
    default {
        Write-Host "`n❌ Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT-GUIDE.md" -ForegroundColor Cyan
Write-Host ""
