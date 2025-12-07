'use strict';

const { Contract } = require('fabric-contract-api');
const { get, put, key } = require('../lib/utils');
const { 
  newCompany, 
  newProject, 
  newCertificate, 
  newRetirementRequest,
  calculateCertificateHash 
} = require('../lib/models');

class CarbonContract extends Contract {

  // ================== COMPANY ==================
  async registerCompany(ctx, id, name) {
    const exists = await get(ctx, key.company(id));
    if (exists) throw new Error(`Company ${id} already exists`);

    const ts = ctx.stub.getTxTimestamp();
    const createdAt = ts.seconds.low * 1000;
    const txId = ctx.stub.getTxID();

    const company = newCompany(id, name, createdAt);
    
    // ✅ Add blockchain metadata
    company.blockchainMetadata = {
      txId: txId,
      timestamp: createdAt,
      creator: ctx.clientIdentity.getID(),
      channelId: ctx.stub.getChannelID()
    };
    
    await put(ctx, key.company(id), company);
    
    // ✅ Emit event
    ctx.stub.setEvent('CompanyRegistered', Buffer.from(JSON.stringify({
      companyId: id,
      name: name,
      txId: txId,
      timestamp: createdAt
    })));
    
    return company;
  }

  async validateCompany(ctx, id) {
    const company = await get(ctx, key.company(id));
    if (!company) throw new Error('Company not found');

    const ts = ctx.stub.getTxTimestamp();
    const txId = ctx.stub.getTxID();
    
    company.regulatorValidated = true;
    company.validatedAt = ts.seconds.low * 1000;
    company.validatedBy = ctx.clientIdentity.getID();
    company.validationTxId = txId;
    
    await put(ctx, key.company(id), company);
    
    ctx.stub.setEvent('CompanyValidated', Buffer.from(JSON.stringify({
      companyId: id,
      validatedBy: company.validatedBy,
      txId: txId,
      timestamp: company.validatedAt
    })));
    
    return company;
  }

  async getCompany(ctx, id) {
    const company = await get(ctx, key.company(id));
    if (!company) throw new Error(`Company ${id} not found`);
    return company;
  }

  // ================== PROJECT ==================
  async registerProject(ctx, projectId, companyId, title, description) {
    const company = await get(ctx, key.company(companyId));
    if (!company?.regulatorValidated) throw new Error('Company must be validated');

    const ts = ctx.stub.getTxTimestamp();
    const createdAt = ts.seconds.low * 1000;
    const txId = ctx.stub.getTxID();

    const project = newProject(projectId, companyId, title, description, createdAt);
    
    project.blockchainMetadata = {
      txId: txId,
      timestamp: createdAt,
      creator: ctx.clientIdentity.getID(),
      channelId: ctx.stub.getChannelID(),
      companyId: companyId
    };
    
    await put(ctx, key.project(projectId), project);
    
    ctx.stub.setEvent('ProjectRegistered', Buffer.from(JSON.stringify({
      projectId: projectId,
      companyId: companyId,
      title: title,
      txId: txId,
      timestamp: createdAt
    })));
    
    return project;
  }

  async validateProject(ctx, projectId) {
    const project = await get(ctx, key.project(projectId));
    if (!project) throw new Error('Project not found');

    const ts = ctx.stub.getTxTimestamp();
    const txId = ctx.stub.getTxID();

    project.regulatorValidated = true;
    project.validatedAt = ts.seconds.low * 1000;
    project.validatedBy = ctx.clientIdentity.getID();
    project.validationTxId = txId;
    
    await put(ctx, key.project(projectId), project);
    
    ctx.stub.setEvent('ProjectValidated', Buffer.from(JSON.stringify({
      projectId: projectId,
      validatedBy: project.validatedBy,
      txId: txId,
      timestamp: project.validatedAt
    })));
    
    return project;
  }

  // ================== CERTIFICATE ==================
  async createCertificate(ctx, certId, projectId, ownerId, amount, pricePerUnit, expiresAt) {
    const project = await get(ctx, key.project(projectId));
    if (!project?.regulatorValidated) throw new Error('Project must be validated');

    const ts = ctx.stub.getTxTimestamp();
    const issuedAt = ts.seconds.low * 1000;
    const txId = ctx.stub.getTxID();

    const cert = newCertificate(certId, projectId, ownerId, amount, pricePerUnit, expiresAt, issuedAt);
    
    // ✅ Add blockchain metadata
    cert.blockchainMetadata = {
      txId: txId,
      issuedAtTimestamp: issuedAt,
      issuer: ctx.clientIdentity.getID(),
      channelId: ctx.stub.getChannelID(),
      chaincodeName: 'carboncc'
    };
    
    // ✅ Calculate and store certificate hash
    cert.certificateHash = calculateCertificateHash(cert);
    
    await put(ctx, key.cert(certId), cert);
    
    ctx.stub.setEvent('CertificateCreated', Buffer.from(JSON.stringify({
      certId: certId,
      projectId: projectId,
      ownerId: ownerId,
      amount: amount,
      pricePerUnit: pricePerUnit,
      txId: txId,
      timestamp: issuedAt,
      certificateHash: cert.certificateHash
    })));
    
    return cert;
  }

  async listCertificate(ctx, certId, pricePerUnit) {
    const cert = await get(ctx, key.cert(certId));
    if (!cert) throw new Error('Certificate not found');
    
    const txId = ctx.stub.getTxID();
    const ts = ctx.stub.getTxTimestamp();
    const listedAt = ts.seconds.low * 1000;

    cert.listed = true;
    cert.pricePerUnit = Number(pricePerUnit);
    cert.status = 'LISTED';
    cert.listedAt = listedAt;
    cert.listedTxId = txId;

    await put(ctx, key.cert(certId), cert);
    
    ctx.stub.setEvent('CertificateListed', Buffer.from(JSON.stringify({
      certId: certId,
      pricePerUnit: pricePerUnit,
      listedBy: ctx.clientIdentity.getID(),
      txId: txId,
      timestamp: listedAt
    })));
    
    return cert;
  }

  async buyCertificate(ctx, certId, buyerCompanyId) {
    const cert = await get(ctx, key.cert(certId));
    if (!cert?.listed) throw new Error('Certificate not available');
    
    const txId = ctx.stub.getTxID();
    const ts = ctx.stub.getTxTimestamp();
    const soldAt = ts.seconds.low * 1000;
    
    // ✅ Store ownership history
    const previousOwner = cert.ownerId;
    
    cert.ownershipHistory.push({
      from: previousOwner,
      to: buyerCompanyId,
      txId: txId,
      timestamp: soldAt,
      price: cert.pricePerUnit,
      amount: cert.amount
    });

    cert.ownerId = buyerCompanyId;
    cert.listed = false;
    cert.status = 'OWNED';
    cert.lastTransferTxId = txId;

    await put(ctx, key.cert(certId), cert);
    
    ctx.stub.setEvent('CertificatePurchased', Buffer.from(JSON.stringify({
      certId: certId,
      from: previousOwner,
      to: buyerCompanyId,
      price: cert.pricePerUnit,
      amount: cert.amount,
      txId: txId,
      timestamp: soldAt
    })));
    
    return cert;
  }

  // ================== RETIREMENT ==================
  async retireCertificates(ctx, certId, retirementReason, retirementBeneficiary) {
    const cert = await get(ctx, key.cert(certId));
    if (!cert) throw new Error('Certificate not found');
    
    const txId = ctx.stub.getTxID();
    const ts = ctx.stub.getTxTimestamp();
    const retiredAt = ts.seconds.low * 1000;

    cert.status = 'RETIRED';
    cert.listed = false;
    cert.retiredAt = retiredAt;
    cert.retiredTxId = txId;
    cert.retiredBy = ctx.clientIdentity.getID();
    cert.retirementReason = retirementReason || null;
    cert.retirementBeneficiary = retirementBeneficiary || null;

    await put(ctx, key.cert(certId), cert);
    
    ctx.stub.setEvent('CertificateRetired', Buffer.from(JSON.stringify({
      certId: certId,
      retiredBy: cert.retiredBy,
      retirementReason: retirementReason,
      txId: txId,
      timestamp: retiredAt
    })));
    
    return cert;
  }

  // ================== QUERY ==================
  async getCertificate(ctx, id) {
    return await get(ctx, key.cert(id));
  }

  async getCertificateWithProof(ctx, id) {
    const cert = await get(ctx, key.cert(id));
    if (!cert) throw new Error('Certificate not found');
    
    const txId = ctx.stub.getTxID();
    const ts = ctx.stub.getTxTimestamp();
    
    return {
      certificate: cert,
      blockchainProof: {
        queryTxId: txId,
        queryTimestamp: ts.seconds.low * 1000,
        channelId: ctx.stub.getChannelID(),
        verified: true
      }
    };
  }

  async getTransactionHistory(ctx, certId) {
    const iterator = await ctx.stub.getHistoryForKey(key.cert(certId));
    const results = [];

    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        const record = {
          txId: res.value.txId,
          isDelete: res.value.isDelete,
          timestamp: res.value.timestamp?.seconds?.low * 1000,
          timestampISO: new Date(res.value.timestamp?.seconds?.low * 1000).toISOString(),
          value: JSON.parse(res.value.value.toString('utf8'))
        };
        results.push(record);
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }
    return results;
  }

  async verifyCertificateIntegrity(ctx, certId) {
    const cert = await get(ctx, key.cert(certId));
    if (!cert) throw new Error('Certificate not found');
    
    const currentHash = calculateCertificateHash(cert);
    const isValid = cert.certificateHash === currentHash;
    
    return {
      certId: certId,
      isValid: isValid,
      storedHash: cert.certificateHash,
      currentHash: currentHash,
      timestamp: Date.now()
    };
  }

  async getCertificateBlockchainMetadata(ctx, certId) {
    const cert = await get(ctx, key.cert(certId));
    if (!cert) throw new Error('Certificate not found');
    
    return {
      certId: certId,
      blockchainMetadata: cert.blockchainMetadata || {},
      certificateHash: cert.certificateHash,
      ownershipHistory: cert.ownershipHistory || [],
      creationTxId: cert.blockchainMetadata?.txId,
      lastTransferTxId: cert.lastTransferTxId,
      retiredTxId: cert.retiredTxId
    };
  }

  async getAvailableCertificates(ctx) {
    const query = { selector: { listed: true, status: 'LISTED' } };
    return await this._richQuery(ctx, query);
  }

  async getCertificatesByOwner(ctx, ownerId) {
    const query = { selector: { ownerId } };
    return await this._richQuery(ctx, query);
  }

  async _richQuery(ctx, query) {
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const results = [];

    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        results.push(JSON.parse(res.value.value.toString('utf8')));
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }
    return results;
  }
}

module.exports = CarbonContract;