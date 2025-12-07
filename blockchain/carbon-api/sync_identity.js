const fs = require('fs');
const path = require('path');

console.log('🔄 Syncing identity with blockchain network...\n');

// CORRECT PATH & FILENAME
const certPath = path.join(__dirname, '../organizations/peerOrganizations/seller.carbon.com/users/Admin@seller.carbon.com/msp/signcerts/Admin@seller.carbon.com-cert.pem');
const keyDir = path.join(__dirname, '../organizations/peerOrganizations/seller.carbon.com/users/Admin@seller.carbon.com/msp/keystore');

console.log('📜 Certificate path:', certPath);
console.log('🔑 Key directory:', keyDir);
console.log('');

// Check if certificate exists
if (!fs.existsSync(certPath)) {
    console.error('❌ Certificate not found at:', certPath);
    process.exit(1);
}

// Check if key directory exists
if (!fs.existsSync(keyDir)) {
    console.error('❌ Key directory not found at:', keyDir);
    process.exit(1);
}

// Read certificate
const certificate = fs.readFileSync(certPath, 'utf8');
console.log('✅ Certificate loaded:', certificate.length, 'bytes');

// Read private key
const keyFiles = fs.readdirSync(keyDir);
if (keyFiles.length === 0) {
    console.error('❌ No key files found in directory');
    process.exit(1);
}

console.log('   Key files found:', keyFiles);
const privateKey = fs.readFileSync(path.join(keyDir, keyFiles[0]), 'utf8');
console.log('✅ Private key loaded:', privateKey.length, 'bytes');

// Create identity
const identity = { 
    credentials: { certificate, privateKey }, 
    mspId: 'SellerMSP', 
    type: 'X.509', 
    version: 1 
};

// Create wallet directory
fs.mkdirSync('wallet', { recursive: true });

// Write identity to wallet
fs.writeFileSync('wallet/sellerAdmin.id', JSON.stringify(identity, null, 2));

console.log('\n✅ Identity synced successfully!');
console.log('   Wallet: wallet/sellerAdmin.id');
console.log('   MSP: SellerMSP');
