#!/bin/bash
set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         QUICK JOIN ALL PEERS TO CARBONCHANNEL                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "👤 User: ReyhanZidany"
echo "⏰ Time: $(date -u '+%Y-%m-%d %H:%M:%S') UTC"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

CHANNEL_NAME="carbonchannel"

# Define all peers
PEERS=(
    "peer0.seller.carbon.com:7051:SellerMSP:seller.carbon.com"
    "peer1.seller.carbon.com:8051:SellerMSP:seller.carbon.com"
    "peer0.buyer.carbon.com:9051:BuyerMSP:buyer.carbon.com"
    "peer1.buyer.carbon.com:10051:BuyerMSP:buyer.carbon.com"
    "peer0.regulator.carbon.com:11051:RegulatorMSP:regulator.carbon.com"
    "peer1.regulator.carbon.com:12051:RegulatorMSP:regulator.carbon.com"
)

echo "📦 Step 1: Fetching channel block..."
docker exec cli bash -c "
  export CORE_PEER_ADDRESS=peer0.seller.carbon.com:7051
  export CORE_PEER_LOCALMSPID=SellerMSP
  export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/seller.carbon.com/users/Admin@seller.carbon.com/msp
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/seller.carbon.com/peers/peer0.seller.carbon.com/tls/ca.crt
  
  peer channel fetch 0 ${CHANNEL_NAME}.block -o orderer.carbon.com:7050 -c ${CHANNEL_NAME} --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/carbon.com/orderers/orderer.carbon.com/msp/tlscacerts/tlsca.carbon.com-cert.pem
"

if [ $? -eq 0 ]; then
    echo "✅ Channel block fetched"
else
    echo "❌ Failed to fetch block"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Step 2: Joining all peers..."
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0

for PEER_INFO in "${PEERS[@]}"; do
    IFS=':' read -r PEER_HOST PEER_PORT MSP_ID ORG_DOMAIN <<< "$PEER_INFO"
    
    echo "┌─ Joining: $PEER_HOST ───────────────────────────────────────"
    echo "│  MSP: $MSP_ID"
    echo "│  Port: $PEER_PORT"
    echo "│"
    
    RESULT=$(docker exec cli bash -c "
      export CORE_PEER_ADDRESS=${PEER_HOST}:${PEER_PORT}
      export CORE_PEER_LOCALMSPID=${MSP_ID}
      export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/users/Admin@${ORG_DOMAIN}/msp
      export CORE_PEER_TLS_ENABLED=true
      export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/ca.crt
      
      peer channel join -b ${CHANNEL_NAME}.block 2>&1
    ")
    
    if echo "$RESULT" | grep -q "Successfully submitted proposal\|already joined"; then
        echo "│  ✅ SUCCESS"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "│  ❌ FAILED"
        echo "│  Error: $RESULT"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    echo "└──────────────────────────────────────────────────────────────"
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 SUMMARY"
echo "├─ Successful: $SUCCESS_COUNT"
echo "└─ Failed: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "✅ All peers joined successfully!"
else
    echo "⚠️  Some peers failed to join"
fi

echo ""
echo "⏳ Waiting 15 seconds for gossip sync..."
sleep 15

echo ""
echo "🔍 Verifying membership..."
echo ""

# Verify
for PEER_INFO in "${PEERS[@]}"; do
    IFS=':' read -r PEER_HOST PEER_PORT MSP_ID ORG_DOMAIN <<< "$PEER_INFO"
    
    CHANNELS=$(docker exec cli bash -c "
      export CORE_PEER_ADDRESS=${PEER_HOST}:${PEER_PORT}
      export CORE_PEER_LOCALMSPID=${MSP_ID}
      export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/users/Admin@${ORG_DOMAIN}/msp
      export CORE_PEER_TLS_ENABLED=true
      export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/ca.crt
      
      peer channel list 2>&1
    " | grep "$CHANNEL_NAME" || echo "")
    
    if [ -n "$CHANNELS" ]; then
        echo "✅ $PEER_HOST - Joined"
    else
        echo "❌ $PEER_HOST - NOT joined"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Join process complete!"
echo ""
echo "📝 Next steps:"
echo "   ./scripts/check-channel-membership.sh"
echo "   ./scripts/check-block-heights.sh"
echo "   ./scripts/check-all-peers.sh"
echo ""