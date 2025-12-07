#!/bin/bash
set -e
export CHANNEL_NAME="carbonchannel"
export CC_NAME="carboncc"
export CC_VERSION="1.0"
export CC_SEQUENCE="1"

echo "Memeriksa kesiapan commit..."
docker exec cli peer lifecycle chaincode checkcommitreadiness \
    --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} \
    --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/carbon.com/orderers/orderer.carbon.com/msp/tlscacerts/tlsca.carbon.com-cert.pem --output json

echo "Melakukan commit..."
docker exec -e CORE_PEER_ADDRESS=peer0.seller.carbon.com:7051 \
    -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/seller.carbon.com/users/Admin@seller.carbon.com/msp \
    cli peer lifecycle chaincode commit -o orderer.carbon.com:7050 --ordererTLSHostnameOverride orderer.carbon.com \
    --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} \
    --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/carbon.com/orderers/orderer.carbon.com/msp/tlscacerts/tlsca.carbon.com-cert.pem \
    --peerAddresses peer0.seller.carbon.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/seller.carbon.com/peers/peer0.seller.carbon.com/tls/ca.crt \
    --peerAddresses peer0.buyer.carbon.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/buyer.carbon.com/peers/peer0.buyer.carbon.com/tls/ca.crt \
    --peerAddresses peer0.regulator.carbon.com:11051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/regulator.carbon.com/peers/peer0.regulator.carbon.com/tls/ca.crt

echo "========== Chaincode berhasil di-commit ke channel =========="

echo "Memverifikasi chaincode yang sudah di-commit..."
docker exec cli peer lifecycle chaincode querycommitted --channelID ${CHANNEL_NAME} --name ${CC_NAME}

