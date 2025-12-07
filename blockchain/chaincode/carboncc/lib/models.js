// chaincode/carboncc/lib/models.js

const crypto = require('crypto');

module.exports = {
  // ✅ Company Model - Updated
  newCompany: (id, name, createdAt) => ({
    id,
    name,
    regulatorValidated: false,
    createdAt,
    // ✅ TAMBAHAN: Metadata fields
    validatedAt: null,
    validatedBy: null,
    validationTxId: null,
    blockchainMetadata: null
  }),

  // ✅ Project Model - Updated
  newProject: (id, companyId, title, description = '', createdAt) => ({
    id,
    companyId,
    title,
    description,
    regulatorValidated: false,
    createdAt,
    // ✅ TAMBAHAN: Metadata fields
    validatedAt: null,
    validatedBy: null,
    validationTxId: null,
    blockchainMetadata: null
  }),

  // ✅ Certificate Model - Updated (MAJOR CHANGES)
  newCertificate: (id, projectId, ownerId, amount, pricePerUnit, expiresAt, issuedAt) => ({
    certId: id,              // ✅ Changed from 'id' to 'certId' for consistency
    projectId,
    ownerId,
    amount: Number(amount),
    pricePerUnit: pricePerUnit != null ? Number(pricePerUnit) : null,
    status: 'ISSUED',
    listed: false,
    issuedAt,
    expiresAt: expiresAt != null ? Number(expiresAt) : null,
    
    // ✅ TAMBAHAN: Blockchain metadata
    blockchainMetadata: null,
    certificateHash: null,
    
    // ✅ TAMBAHAN: Ownership tracking
    ownershipHistory: [],
    
    // ✅ TAMBAHAN: Transaction tracking
    listedAt: null,
    listedTxId: null,
    lastTransferTxId: null,
    
    // ✅ TAMBAHAN: Retirement tracking
    retiredAt: null,
    retiredTxId: null,
    retiredBy: null,
    retirementReason: null,
    retirementBeneficiary: null,
    
    // ✅ TAMBAHAN: Expiration tracking
    expiredTxId: null
  }),

  // ✅ Retirement Request Model - Updated
  newRetirementRequest: (id, certId, requester, createdAt) => ({
    id,
    certId,
    requester,
    status: 'PENDING',
    createdAt,
    // ✅ TAMBAHAN: Approval tracking
    approvedAt: null,
    approvedBy: null,
    approvalTxId: null,
    requestTxId: null
  }),

  // ✅ NEW: Helper function untuk calculate certificate hash
  calculateCertificateHash: (cert) => {
    const dataString = JSON.stringify({
      certId: cert.certId,
      projectId: cert.projectId,
      amount: cert.amount,
      ownerId: cert.ownerId,
      issuedAt: cert.issuedAt
    });
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
};