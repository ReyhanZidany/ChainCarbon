#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_ID=$(cat "$DIR/package.id")
if [ -z "$PACKAGE_ID" ]; then
  echo "Package ID tidak ditemukan! Jalankan 0_query_installed.sh terlebih dahulu."
  exit 1
fi

SEQUENCE=1

echo "Menyetujui chaincode sebagai BUYER..."

docker exec cli bash -c "\
export CORE_PEER_LOCALMSPID=BuyerMSP; \
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/buyer.carbon.com/users/Admin@buyer.carbon.com/msp; \
export CORE_PEER_ADDRESS=peer0.buyer.carbon.com:9051; \
export CORE_PEER_TLS_ENABLED=true; \
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/buyer.carbon.com/peers/peer0.buyer.carbon.com/tls/ca.crt; \
peer lifecycle chaincode approveformyorg \
--channelID carbonchannel \
--name carboncc \
--version 1.0 \
--package-id $PACKAGE_ID \
--sequence $SEQUENCE \
--tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/carbon.com/orderers/orderer.carbon.com/msp/tlscacerts/tlsca.carbon.com-cert.pem"

echo "Approve chaincode BUYER selesai."

