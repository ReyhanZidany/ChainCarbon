<div align="center">
  <img src="backend/public/assets/chaincarbon_logo_transparent.png" alt="ChainCarbon Logo" width="200"/>
  
  # ChainCarbon
  ### Blockchain-Based Carbon Credit Platform
  
  Decentralized carbon credit marketplace built on Hyperledger Fabric for transparent and immutable carbon trading.
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
  [![Hyperledger Fabric](https://img.shields.io/badge/Fabric-2.5-blue)](https://www.hyperledger.org/use/fabric)
</div>

---

## 🚀 Features

- **Certificate Management**: Issue, transfer, and retire carbon certificates with blockchain verification
- **Marketplace**: Buy and sell carbon credits with real-time pricing and filtering
- **Blockchain Integration**: Immutable transaction history via Hyperledger Fabric
- **Regulator Dashboard**: Audit and approve carbon projects with validation workflows
- **PDF Generation**: Automated retirement confirmation documents with certificate details
- **Transaction History**: Complete audit trail of all certificate operations
- **Project Validation**: Multi-stage approval process for carbon offset projects
- **Certificate Verification**: Public verification of certificate authenticity via blockchain

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express. js
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Email**: Nodemailer
- **Validation**: Express Validator

### Blockchain
- **Platform**: Hyperledger Fabric 2.5
- **Smart Contract Language**: JavaScript (Node.js Chaincode)
- **State Database**: CouchDB
- **Consensus**: Raft
- **Organizations**: 3 (Seller, Buyer, Regulator)
- **Channels**: 1 (carbonchannel)
- **Chaincode**: CarbonContract (certificate lifecycle management)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git
- **Package Manager**: npm

---
