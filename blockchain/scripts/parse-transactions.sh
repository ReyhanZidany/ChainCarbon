#!/bin/bash

PEER_NAME="peer0.seller.carbon.com"
LINES=${1:-100}

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         HYPERLEDGER FABRIC TRANSACTION LOG ANALYZER           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Peer: $PEER_NAME"
echo "📝 Analyzing last $LINES transactions"
echo "⏰ Current Time: $(date '+%Y-%m-%d %H:%M:%S UTC')"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Counter
COUNTER=1

# Get and parse logs
docker logs --tail $LINES $PEER_NAME 2>&1 | grep -E "endorser.*callChaincode.*finished" | while IFS= read -r line; do
    # Extract details
    TIMESTAMP=$(echo "$line" | awk '{print $1, $2}')
    TXID=$(echo "$line" | grep -oP "txID=\K\w+")
    DURATION=$(echo "$line" | grep -oP "duration:\s*\K\d+ms")
    CHANNEL=$(echo "$line" | grep -oP "channel=\K\w+")
    CHAINCODE=$(echo "$line" | grep -oP "chaincode:\s*\K\w+")
    
    # Color code based on duration
    if [ "${DURATION%ms}" -lt 5 ]; then
        STATUS="🟢 FAST"
    elif [ "${DURATION%ms}" -lt 15 ]; then
        STATUS="🟡 NORMAL"
    else
        STATUS="🔴 SLOW"
    fi
    
    echo "┌─ Transaction #$COUNTER ──────────────────────────────────────────"
    echo "│"
    echo "│  📅 Timestamp    : $TIMESTAMP"
    echo "│  🆔 TX ID        : $TXID"
    echo "│  📡 Channel      : $CHANNEL"
    echo "│  🔗 Chaincode    : $CHAINCODE"
    echo "│  ⏱️  Duration     : $DURATION $STATUS"
    echo "│  ✅ Status       : COMPLETED"
    echo "│"
    echo "└──────────────────────────────────────────────────────────────────"
    echo ""
    
    COUNTER=$((COUNTER + 1))
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Analysis Complete"
echo ""