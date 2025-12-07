#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         BLOCK HEIGHT VERIFICATION                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PEERS=(
    "peer0.seller.carbon.com:7051:seller"
    "peer1.seller.carbon.com:8051:seller"
    "peer0.buyer.carbon.com:9051:buyer"
    "peer1.buyer.carbon.com:10051:buyer"
    "peer0.regulator.carbon.com:11051:regulator"
    "peer1.regulator.carbon.com:12051:regulator"
)

MAX_HEIGHT=0
declare -A HEIGHTS

for PEER_INFO in "${PEERS[@]}"; do
    IFS=':' read -r PEER_HOST PEER_PORT ORG <<< "$PEER_INFO"
    MSP_ID="${ORG^}MSP"
    
    echo "🔍 Checking $PEER_HOST..."
    
    RESULT=$(docker exec cli bash -c "
        export CORE_PEER_ADDRESS=$PEER_HOST:$PEER_PORT
        export CORE_PEER_LOCALMSPID=$MSP_ID
        export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG}.carbon.com/users/Admin@${ORG}.carbon.com/msp
        
        peer channel getinfo -c carbonchannel 2>&1
    " 2>/dev/null)
    
    HEIGHT=$(echo "$RESULT" | grep -oP "height:\s*\K\d+" || echo "0")
    HEIGHTS[$PEER_HOST]=$HEIGHT
    
    if [ $HEIGHT -gt $MAX_HEIGHT ]; then
        MAX_HEIGHT=$HEIGHT
    fi
    
    echo "  Block Height: $HEIGHT"
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 BLOCK HEIGHT ANALYSIS"
echo ""

for PEER in "${!HEIGHTS[@]}"; do
    HEIGHT=${HEIGHTS[$PEER]}
    DIFF=$((MAX_HEIGHT - HEIGHT))
    
    if [ $DIFF -eq 0 ]; then
        STATUS="✅ SYNCED"
    elif [ $DIFF -lt 5 ]; then
        STATUS="⚠️  SLIGHTLY BEHIND ($DIFF blocks)"
    else
        STATUS="❌ SEVERELY LAGGING ($DIFF blocks behind)"
    fi
    
    printf "%-40s : %5d blocks %s\n" "$PEER" "$HEIGHT" "$STATUS"
done

echo ""
echo "Maximum Block Height: $MAX_HEIGHT"
echo ""