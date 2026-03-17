# Deploy Logowhistle Backend to VPS
$hostIp = "148.135.137.235"
$user = "root"
$remotePath = "/home/eduwhistle-admin-logowhistle/htdocs/admin-logowhistle.eduwhistle.com"

Write-Host "--- Step 1: Packaging Backend ---" -ForegroundColor Cyan
tar --exclude="node_modules" --exclude=".tmp" -cvzf backend.tar.gz .
if ($LASTEXITCODE -ne 0) { Write-Error "Packaging failed!"; exit }

Write-Host "--- Step 2: Transferring to VPS ---" -ForegroundColor Cyan
Write-Host "Please enter the VPS password when prompted." -ForegroundColor Yellow
scp backend.tar.gz .env root@${hostIp}:/root/
if ($LASTEXITCODE -ne 0) { Write-Error "Transfer failed! Please check your password and connection."; exit }

Write-Host "--- Step 3: Setting up on Server ---" -ForegroundColor Cyan
$remoteCommands = @"
rm -rf $remotePath/*
mkdir -p $remotePath
tar -xzf /root/backend.tar.gz -C $remotePath
mv /root/.env $remotePath/
cd $remotePath
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
npm install
npm run build
echo "Backend Build Complete!"

# Restart with PM2
pm2 restart logowhistle-backend || pm2 start npm --name "logowhistle-backend" --env PORT=7000,NODE_ENV=production -- start
pm2 save
echo "Backend Started on Port 7000!"
"@

ssh root@${hostIp} "$remoteCommands"
if ($LASTEXITCODE -ne 0) { Write-Error "Remote setup failed!"; exit }

Write-Host "--- Deployment Finished! ---" -ForegroundColor Green
Write-Host "Next Step: Configure Cloud Panel to point to $remotePath and run 'node server.js' on Port 7000" -ForegroundColor Cyan
