const express = require('express');
const cors = require('cors');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();

// ================== MIDDLEWARE (✅ CORRECT ORDER) ==================
// 1️⃣ CORS Configuration FIRST
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'ngrok-skip-browser-warning',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ],
  credentials: false
}));

// ✅ NEW (Express built-in)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// === Load connection profile ===
const ccpPath = path.resolve(__dirname, 'connection', 'connection-seller.json');

let ccp;
try {
  ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
} catch (error) {
  console.error('❌ Error loading connection profile:', error.message);
  process.exit(1);
}

// === Helper: Get contract with proper connection management ===
async function getContract() {
  let gateway;
  try {
    const wallet = await Wallets.newFileSystemWallet(path.join(process.cwd(), 'wallet'));
    gateway = new Gateway();
    
    await gateway.connect(ccp, {
      wallet,
      identity: 'sellerAdmin',
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('carbonchannel');
    const contract = network.getContract('carboncc');
    
    return { contract, gateway };
  } catch (error) {
    if (gateway) {
      await gateway.disconnect();
    }
    throw error;
  }
}

// === Enhanced error handler ===
function handleError(res, error, operation = 'operation') {
  console.error(`❌ Error during ${operation}:`, error);
  
  let statusCode = 500;
  let message = error.message || 'Internal server error';
  
  // Handle specific Hyperledger Fabric errors
  if (message.includes('not found')) {
    statusCode = 404;
  } else if (message.includes('already exists')) {
    statusCode = 409;
  } else if (message.includes('must be validated') || message.includes('not available')) {
    statusCode = 400;
  }
  
  res.status(statusCode).json({ 
    error: message,
    operation,
    timestamp: new Date().toISOString()
  });
}

// ================== ROUTES START HERE ==================
// (All your existing routes - companies, projects, certificates, etc.)

//
// ================== COMPANY ==================
//
app.post('/companies', async (req, res) => {
  let gateway;
  try {
    const { id, name } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: 'ID and name are required' });
    }
    
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('registerCompany', id, name);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'register company');
  }
});

app.post('/companies/:id/validate', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('validateCompany', req.params.id);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'validate company');
  }
});

app.get('/companies/:id', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.evaluateTransaction('getCompany', req.params.id);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'get company');
  }
});

//
// ================== PROJECT ==================
//
app.post('/projects', async (req, res) => {
  let gateway;
  try {
    const { id, companyId, title, description } = req.body;
    
    if (!id || !companyId || !title || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('registerProject', id, companyId, title, description);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'register project');
  }
});

app.post('/projects/:id/validate', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('validateProject', req.params.id);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'validate project');
  }
});

//
// ================== CERTIFICATE ==================
//
app.post('/certificates', async (req, res) => {
  let gateway;
  try {
    const { id, projectId, ownerId, amount, pricePerUnit, expiresAt } = req.body;
    
    if (!id || !projectId || !ownerId || !amount || !pricePerUnit || !expiresAt) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction(
      'createCertificate',
      id, projectId, ownerId,
      amount.toString(), pricePerUnit.toString(), expiresAt.toString()
    );
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'create certificate');
  }
});

app.post('/certificates/:id/list', async (req, res) => {
  let gateway;
  try {
    const { pricePerUnit } = req.body;
    
    if (!pricePerUnit) {
      return res.status(400).json({ error: 'Price per unit is required' });
    }
    
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('listCertificate', req.params.id, pricePerUnit.toString());
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'list certificate');
  }
});

app.post('/certificates/:id/buy', async (req, res) => {
  let gateway;
  try {
    const { buyerId } = req.body;
    
    if (!buyerId) {
      return res.status(400).json({ error: 'Buyer ID is required' });
    }
    
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('buyCertificate', req.params.id, buyerId);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'buy certificate');
  }
});

// ✅ RETIRE CERTIFICATE ENDPOINT
app.post('/certificates/:id/retire', async (req, res) => {
  let gateway;
  try {
    // ✅ DEBUG LOGS
    console.log("\n🔍 DEBUG: Retire Request Received");
    console.log("   Method:", req.method);
    console.log("   URL:", req.url);
    console.log("   Content-Type:", req.get('Content-Type'));
    console.log("   Body:", JSON.stringify(req.body, null, 2));
    console.log("   Body type:", typeof req.body);
    console.log("   Body keys:", Object.keys(req.body));
    console.log("   Body empty?:", Object.keys(req.body).length === 0);
    
    const { retirementReason, retirementBeneficiary } = req.body;
    
    console.log("\n🔄 Fabric API: Retiring certificate");
    console.log("   Cert ID:", req.params.id);
    console.log("   Reason (from destructure):", retirementReason);
    console.log("   Beneficiary (from destructure):", retirementBeneficiary);
    console.log("   Reason (direct access):", req.body.retirementReason);
    console.log("   Beneficiary (direct access):", req.body.retirementBeneficiary);
    
    // ✅ Validation
    if (!retirementReason) {
      console.error("❌ Validation failed: retirementReason is missing");
      console.error("   Full request body:", JSON.stringify(req.body));
      return res.status(400).json({ 
        error: 'retirementReason is required',
        operation: 'retire certificate',
        receivedBody: req.body,
        receivedHeaders: {
          contentType: req.get('Content-Type'),
          contentLength: req.get('Content-Length')
        }
      });
    }
    
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    console.log("\n📤 Submitting transaction to chaincode:");
    console.log("   Function: retireCertificates");
    console.log("   Param 1 (certId):", req.params.id);
    console.log("   Param 2 (reason):", retirementReason);
    console.log("   Param 3 (beneficiary):", retirementBeneficiary || '');
    
    const result = await contract.submitTransaction(
      'retireCertificates',
      req.params.id,
      retirementReason,
      retirementBeneficiary || ''
    );
    
    await gateway.disconnect();
    
    const cert = JSON.parse(result.toString());
    
    console.log("\n✅ Certificate retired successfully");
    console.log("   Status:", cert.status);
    console.log("   Retired At:", cert.retiredAt);
    console.log("   Retired By:", cert.retiredBy);
    console.log("   Retirement Reason:", cert.retirementReason);
    console.log("   Retirement Beneficiary:", cert.retirementBeneficiary);
    console.log("   TX ID:", cert.retiredTxId);
    
    res.json(cert);
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'retire certificate');
  }
});


app.get('/certificates/available', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;

    // ✅ Panggil fungsi CHAINCODE yang benar
    const result = await contract.evaluateTransaction('getAvailableCertificates');
    await gateway.disconnect();

    // ✅ Kalau kosong, balikin array kosong, BUKAN error
    const jsonString = result && result.length > 0
      ? result.toString('utf8')
      : '[]';

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.error('❌ Failed to parse getAvailableCertificates result:', e.message, 'raw:', jsonString);
      parsed = []; // fallback aja ke array kosong
    }

    return res.json(parsed);
  } catch (err) {
    if (gateway) await gateway.disconnect();
    // ✅ Pastikan operation-nya ini
    handleError(res, err, 'get available certificates');
  }
});

app.get('/certificates/:id', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.evaluateTransaction('getCertificate', req.params.id);
    await gateway.disconnect();
    
    // ✅ CRITICAL FIX: Safe parsing
    if (!result || result.length === 0) {
      return res.status(404).json({ 
        error: 'Certificate not found in blockchain',
        operation: 'get certificate',
        certificateId: req.params.id
      });
    }
    
    let parsed;
    try {
      const resultStr = result.toString();
      console.log('Raw blockchain response preview:', resultStr.substring(0, 150));
      
      if (!resultStr || resultStr.trim() === '' || resultStr === 'null') {
        console.error('❌ Invalid response string');
        return res.status(404).json({ 
          error: 'Certificate not found',
          operation: 'get certificate'
        });
      }
      
      parsed = JSON.parse(resultStr);
      
      if (!parsed || typeof parsed !== 'object') {
        console.error('❌ Parsed result is not a valid object:', parsed);
        return res.status(500).json({ 
          error: 'Invalid certificate data structure',
          operation: 'get certificate'
        });
      }
      
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('Response that failed:', result.toString().substring(0, 300));
      return res.status(500).json({ 
        error: 'Failed to parse certificate data',
        operation: 'get certificate',
        details: parseError.message
      });
    }
    
    console.log('✅ Certificate fetched successfully:', parsed.id || parsed.certId);
    res.json(parsed);
    
  } catch (err) {
    if (gateway) await gateway.disconnect();
    console.error('❌ Error in GET /certificates/:id:', err);
    handleError(res, err, 'get certificate');
  }
});

app.get('/certificates/:id/history', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.evaluateTransaction('getTransactionHistory', req.params.id);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'get certificate history');
  }
});

app.get('/certificates/owner/:ownerId', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.evaluateTransaction('getCertificatesByOwner', req.params.ownerId);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'get certificates by owner');
  }
});

app.get('/certificates/status/:status', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.evaluateTransaction('getCertificatesByStatus', req.params.status);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'get certificates by status');
  }
});


//
// ================== RETIREMENT ==================
//
app.post('/retirements', async (req, res) => {
  let gateway;
  try {
    const { id, certId, requester } = req.body;
    
    if (!id || !certId || !requester) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('createRetirementRequest', id, certId, requester);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'create retirement request');
  }
});

app.post('/retirements/:id/approve', async (req, res) => {
  let gateway;
  try {
    const { contract, gateway: gw } = await getContract();
    gateway = gw;
    
    const result = await contract.submitTransaction('approveRetirementRequest', req.params.id);
    await gateway.disconnect();
    
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    if (gateway) await gateway.disconnect();
    handleError(res, err, 'approve retirement request');
  }
});

//
// ================== HEALTH CHECK ==================
//
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Carbon Market API'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🌱 Welcome to Carbon Market API',
    version: '1.0.0',
    endpoints: {
      companies: ['POST /companies', 'POST /companies/:id/validate', 'GET /companies/:id'],
      projects: ['POST /projects', 'POST /projects/:id/validate'],
      certificates: [
        'POST /certificates',
        'POST /certificates/:id/list',
        'POST /certificates/:id/buy',
        'POST /certificates/:id/retire',
        'GET /certificates/:id',
        'GET /certificates/:id/history',
        'GET /certificates/owner/:ownerId',
        'GET /certificates/status/:status',
        'GET /certificates/available'
      ],
      retirements: ['POST /retirements', 'POST /retirements/:id/approve']
    }
  });
});

//
// ================== SERVER START ==================
//
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 Carbon API running at http://localhost:' + PORT);
  console.log('📋 API Documentation available at http://localhost:' + PORT);
  console.log('💚 Health check: http://localhost:' + PORT + '/health');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});