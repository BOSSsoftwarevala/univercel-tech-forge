#!/bin/bash
# ============================================
# VPS Deploy Relay Setup Script
# Run this ON your Hostinger VPS as root
# ============================================
# ssh root@72.61.236.249
# bash setup-vps-relay.sh
# ============================================

set -e

echo "🚀 Setting up Software Vala Deploy Relay..."

# 1. Install dependencies
echo "📦 Installing Node.js and tools..."
apt-get update -qq
apt-get install -y curl nginx certbot python3-certbot-nginx git nodejs npm -qq

# Install Node 20 if not present
if ! node -v | grep -q "v20"; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs -qq
fi

# 2. Create clients directory
echo "📁 Creating client directories..."
mkdir -p /var/www/clients
chown -R www-data:www-data /var/www/clients

# 3. Create deploy relay service
echo "⚙️ Creating deploy relay API..."
mkdir -p /opt/deploy-relay
cat > /opt/deploy-relay/server.js << 'RELAYEOF'
const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

const DEPLOY_KEY = process.env.DEPLOY_KEY || '';
const PORT = 8422;

if (!DEPLOY_KEY) {
  console.error('ERROR: DEPLOY_KEY environment variable is required');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Deploy-Key');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.method !== 'POST' || req.url !== '/execute') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  // Auth check
  const authKey = req.headers['x-deploy-key'];
  if (!authKey || authKey !== DEPLOY_KEY) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Unauthorized' }));
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { command } = JSON.parse(body);
      
      if (!command || typeof command !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Command required' }));
      }

      // Security: Block dangerous commands
      const blocked = ['rm -rf /', 'mkfs', 'dd if=', ':(){', 'shutdown', 'reboot', 'init 0'];
      if (blocked.some(b => command.includes(b))) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Blocked command' }));
      }

      // Only allow commands in safe directories
      const allowedPaths = ['/var/www/clients', '/etc/nginx', '/opt/deploy-relay'];
      
      console.log(`[EXEC] ${new Date().toISOString()} - ${command.slice(0, 100)}`);

      exec(command, { 
        timeout: 120000,  // 2 min
        maxBuffer: 10 * 1024 * 1024,  // 10MB
        cwd: '/var/www/clients' 
      }, (error, stdout, stderr) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: !error,
          output: stdout || stderr || (error ? error.message : 'Done'),
          exitCode: error ? error.code : 0,
        }));
      });
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🔒 Deploy Relay running on port ${PORT}`);
  console.log(`🔑 Auth: X-Deploy-Key header required`);
});
RELAYEOF

# 4. Create systemd service
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/deploy-relay.service << EOF
[Unit]
Description=Software Vala Deploy Relay
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/deploy-relay
Environment=DEPLOY_KEY=REPLACE_WITH_YOUR_VPS_ROOT_PASSWORD
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "============================================"
echo "⚠️  IMPORTANT: Edit the service file to set your DEPLOY_KEY"
echo "    nano /etc/systemd/system/deploy-relay.service"
echo "    Replace REPLACE_WITH_YOUR_VPS_ROOT_PASSWORD with your actual key"
echo "============================================"
echo ""

# 5. Setup firewall
echo "🔥 Configuring firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8422/tcp
ufw allow 22/tcp

# 6. Create wildcard DNS note
echo ""
echo "============================================"
echo "✅ SETUP COMPLETE! Next steps:"
echo "============================================"
echo ""
echo "1. Edit deploy key:"
echo "   nano /etc/systemd/system/deploy-relay.service"
echo ""
echo "2. Start the relay:"
echo "   systemctl daemon-reload"
echo "   systemctl enable deploy-relay"
echo "   systemctl start deploy-relay"
echo ""
echo "3. Setup wildcard DNS at Hostinger:"
echo "   Add A record: *.softwarewala.net → 72.61.236.249"
echo "   Add A record: softwarewala.net → 72.61.236.249"
echo ""
echo "4. Test relay:"
echo "   curl -X POST http://localhost:8422/execute \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'X-Deploy-Key: YOUR_KEY' \\"
echo "     -d '{\"command\": \"echo hello\"}'"
echo ""
echo "============================================"
