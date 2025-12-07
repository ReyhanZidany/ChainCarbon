#!/bin/bash
set -euo pipefail

export CHANNEL_NAME="carbonchannel"
export ORDERER_CA_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/carbon.com/orderers/orderer.carbon.com/msp/tlscacerts/tlsca.carbon.com-cert.pem"

function setGlobals() {
  local ORG=$1
  local PEER_INDEX=$2

  case "$ORG" in
    seller)
      CORE_PEER_LOCALMSPID="SellerMSP"
      ORG_DOMAIN="seller.carbon.com"
      if [ "$PEER_INDEX" -eq 0 ]; then PORT=7051; else PORT=8051; fi
      ;;
    buyer)
      CORE_PEER_LOCALMSPID="BuyerMSP"
      ORG_DOMAIN="buyer.carbon.com"
      if [ "$PEER_INDEX" -eq 0 ]; then PORT=9051; else PORT=10051; fi
      ;;
    regulator)
      CORE_PEER_LOCALMSPID="RegulatorMSP"
      ORG_DOMAIN="regulator.carbon.com"
      if [ "$PEER_INDEX" -eq 0 ]; then PORT=11051; else PORT=12051; fi
      ;;
    *)
      echo "ORG tidak dikenal: $ORG"; exit 1;;
  esac

  CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/users/Admin@${ORG_DOMAIN}/msp"
  CORE_PEER_ADDRESS="peer${PEER_INDEX}.${ORG_DOMAIN}:${PORT}"
  CORE_PEER_TLS_ENABLED=true
  CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/peers/peer${PEER_INDEX}.${ORG_DOMAIN}/tls/ca.crt"

  export CORE_PEER_LOCALMSPID CORE_PEER_MSPCONFIGPATH CORE_PEER_ADDRESS CORE_PEER_TLS_ENABLED CORE_PEER_TLS_ROOTCERT_FILE
}

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         RE-JOIN ALL PEERS TO CARBONCHANNEL                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "👤 User: ReyhanZidany"
echo "⏰ Time: $(date '+%Y-%m-%d %H:%M:%S') UTC"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Fetch channel block
echo "📦 Step 1: Fetching channel genesis block..."
echo ""

setGlobals seller 0

FETCH_CMD="
  export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
  export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
  export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
  export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
  export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
  
  peer channel fetch 0 ${CHANNEL_NAME}.block \
    -o orderer.carbon.com:7050 \
    --ordererTLSHostnameOverride orderer.carbon.com \
    -c ${CHANNEL_NAME} \
    --tls --cafile ${ORDERER_CA_PATH}
"

docker exec cli bash -c "$FETCH_CMD"

if [ $? -eq 0 ]; then
    echo "✅ Channel block fetched successfully"
else
    echo "❌ Failed to fetch channel block"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Step 2: Joining all peers to channel..."
echo ""

# Step 2: Join all peers
for ORG in seller buyer regulator; do
  for PEER in 0 1; do
    setGlobals "$ORG" "$PEER"
    
    echo "┌─ Joining: $CORE_PEER_ADDRESS ───────────────────────────────"
    echo "│"
    echo "│  Organization: ${CORE_PEER_LOCALMSPID}"
    echo "│  Address: ${CORE_PEER_ADDRESS}"
    echo "│"
    
    JOIN_CMD="
      export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
      export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
      export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
      export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
      export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
      
      peer channel join -b ${CHANNEL_NAME}.block
    "
    
    RESULT=$(docker exec cli bash -c "$JOIN_CMD" 2>&1)
    
    if echo "$RESULT" | grep -q "Successfully submitted proposal\|already joined"; then
      echo "│  ✅ Successfully joined channel"
    else
      echo "│  ❌ Failed to join channel"
      echo "│  Error: $RESULT"
    fi
    
    echo "│"
    echo "└──────────────────────────────────────────────────────────────"
    echo ""
    
    sleep 2
  done
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏳ Waiting 10 seconds for gossip sync..."
sleep 10

echo ""
echo "🔍 Step 3: Verifying channel membership..."
echo ""

# Step 3: Verify
for ORG in seller buyer regulator; do
  for PEER in 0 1; do
    setGlobals "$ORG" "$PEER"
    
    VERIFY_CMD="
      export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
      export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
      export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
      export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
      export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
      
      peer channel list
    "
    
    CHANNELS=$(docker exec cli bash -c "$VERIFY_CMD" 2>&1 | grep "carbonchannel" || echo "")
    
    if [ -n "$CHANNELS" ]; then
      echo "✅ $CORE_PEER_ADDRESS - Joined to carbonchannel"
    else
      echo "❌ $CORE_PEER_ADDRESS - NOT joined to carbonchannel"
    fi
  done
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Re-join Process Complete"
echo ""
echo "📝 Next: Run verification scripts"
echo "   ./scripts/check-channel-membership.sh"
echo "   ./scripts/check-block-heights.sh"
echo "   ./scripts/check-all-peers.sh"
echo ""