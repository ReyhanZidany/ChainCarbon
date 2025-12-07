#!/bin/bash
set -e

# Folder skrip ini
DIR="$(cd "$(dirname "$0")" && pwd)"

# Ambil Package ID
PACKAGE_ID=$(cat "$DIR/package.id")
if [ -z "$PACKAGE_ID" ]; then
  echo "Package ID tidak ditemukan! Jalankan 0_query_installed.sh terlebih dahulu."
  exit 1
fi

# Sequence chaincode
SEQUENCE=1

echo "Menyetujui chaincode sebagai SELLER..."

docker exec cli bash -c "\
export CORE_PEER_LOCALMSPID=SellerMSP; \
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/seller.carbon.com/users/Admin@seller.carbon.com/msp; \
export CORE_PEER_ADDRESS=peer0.seller.carbon.com:7051; \
export CORE_PEER_TLS_ENABLED=true; \
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/seller.carbon.com/peers/peer0.seller.carbon.com/tls/ca.crt; \
peer lifecycle chaincode approveformyorg \
--channelID carbonchannel \
--name carboncc \
--version 1.0 \
--package-id $PACKAGE_ID \
--sequence $SEQUENCE \
--tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/carbon.com/orderers/orderer.carbon.com/msp/tlscacerts/tlsca.carbon.com-cert.pem"

echo "Approve chaincode SELLER selesai."

