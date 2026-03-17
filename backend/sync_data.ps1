$VPS_IP = "148.135.137.235"
$VPS_USER = "root"
$REMOTE_PATH = "/home/eduwhistle-admin-logowhistle/htdocs/admin-logowhistle.eduwhistle.com"

Write-Host "Packaging local database, assets, and schema..."
# Added src/api to ensure the new 'name' field changes are uploaded
tar -cvzf data_sync.tar.gz .tmp/data.db public/uploads src/api

Write-Host "--- Step 1: Uploading Files ---"
Write-Host "Please enter the password (dinesh@2026!) when prompted."
scp data_sync.tar.gz "$VPS_USER@$VPS_IP`:$REMOTE_PATH/"

Write-Host "--- Step 2: Applying Changes & Restarting ---"
Write-Host "Please enter the password again."
# Combining all remote commands into one session to reduce typing
# Added npm install to ensure dependencies are present
$remoteCmd = "cd $REMOTE_PATH; tar -xvzf data_sync.tar.gz; npm install && npm run build && pm2 restart logowhistle-backend; rm data_sync.tar.gz"
ssh "$VPS_USER@$VPS_IP" $remoteCmd

Write-Host "✅ Sync and Schema update complete! Please check the admin panel."
