# Deploy Logowhistle Frontend to VPS
$hostIp = "148.135.137.235"
$user = "root"
$remotePath = "/home/eduwhistle-logowhistle/htdocs/logowhistle.eduwhistle.com"

Write-Host "--- Step 1: Packaging Frontend ---" -ForegroundColor Cyan
# Package frontend (excluding node_modules and .next)
tar --exclude="node_modules" --exclude=".next" -cvzf frontend.tar.gz .
if ($LASTEXITCODE -ne 0) { Write-Error "Packaging failed!"; exit }

Write-Host "--- Step 2: Transferring to VPS ---" -ForegroundColor Cyan
Write-Host "Please enter the VPS password when prompted." -ForegroundColor Yellow
scp frontend.tar.gz .env.local root@${hostIp}:/root/
if ($LASTEXITCODE -ne 0) { Write-Error "Transfer failed! Please check your password and connection."; exit }

Write-Host "--- Step 3: Setting up on Server ---" -ForegroundColor Cyan
$remoteCommands = @"
# Clean previous content in the destination folder
rm -rf $remotePath/*
mkdir -p $remotePath
tar -xzf /root/frontend.tar.gz -C $remotePath
mv /root/.env.local $remotePath/.env.local
cd $remotePath

# Ensure correct Node.js version is used (Node 22 as per Cloud Panel)
if ! command -v node &> /dev/null || [[ $(node -v) != v22* ]]; then
    echo "Installing Node.js 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

npm install
npm run build || { echo 'BUILD FAILED! Stopping deployment.'; exit 1; }
echo "Frontend Build Complete!"

# Start with PM2
# We use 'PORT=3080' to avoid conflict with backend
pm2 delete logowhistle-frontend 2>/dev/null || true
PORT=3080 pm2 start npm --name logowhistle-frontend -- start
pm2 save
echo "Frontend Started on Port 3080 via PM2!"
"@

ssh root@${hostIp} "$remoteCommands"
if ($LASTEXITCODE -ne 0) { Write-Error "Remote setup failed!"; exit }

Write-Host "--- Deployment Finished! ---" -ForegroundColor Green
Write-Host "Next Step: Check http://logowhistle.eduwhistle.com" -ForegroundColor Cyan
