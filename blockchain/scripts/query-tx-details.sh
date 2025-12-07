#!/bin/bash

TXID=$1
PEER_NAME="peer0.seller.carbon.com"

if [ -z "$TXID" ]; then
    echo "❌ Usage: $0 <transaction_id>"
    echo "Example: $0 8e75f050"
    exit 1
fi

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              TRANSACTION DETAIL LOOKUP                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🔍 Searching for TX ID: $TXID"
echo "📊 Peer: $PEER_NAME"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Search in logs
RESULT=$(docker logs $PEER_NAME 2>&1 | grep "$TXID")

if [ -z "$RESULT" ]; then
    echo "❌ Transaction not found in peer logs"
    echo ""
    echo "💡 Tips:"
    echo "   - Check if TX ID is correct"
    echo "   - Transaction might be on different peer"
    echo "   - Logs might have been rotated"
    exit 1
fi

echo "✅ Transaction Found!"
echo ""

# Parse and display
echo "$RESULT" | while IFS= read -r line; do
    if echo "$line" | grep -q "endorser.*callChaincode.*finished"; then
        TIMESTAMP=$(echo "$line" | awk '{print $1, $2}')
        DURATION=$(echo "$line" | grep -oP "duration:\s*\K\d+ms")
        CHANNEL=$(echo "$line" | grep -oP "channel=\K\w+")
        CHAINCODE=$(echo "$line" | grep -oP "chaincode:\s*\K\w+")
        
        echo "┌─ TRANSACTION DETAILS ─────────────────────────────────────────"
        echo "│"
        echo "│  🆔 Transaction ID   : $TXID"
        echo "│  📅 Timestamp        : $TIMESTAMP"
        echo "│  📡 Channel          : $CHANNEL"
        echo "│  🔗 Chaincode        : $CHAINCODE"
        echo "│  ⏱️  Duration         : $DURATION"
        echo "│  ✅ Status           : COMPLETED"
        echo "│  📊 Peer             : $PEER_NAME"
        echo "│"
        echo "└───────────────────────────────────────────────────────────────"
        
    elif echo "$line" | grep -q "ProcessProposal"; then
        PEER_ADDRESS=$(echo "$line" | grep -oP "grpc.peer_address=\K[^ ]+")
        CALL_DURATION=$(echo "$line" | grep -oP "grpc.call_duration=\K[^ ]+")
        CODE=$(echo "$line" | grep -oP "grpc.code=\K\w+")
        
        echo "│"
        echo "│  🌐 Peer Address     : $PEER_ADDRESS"
        echo "│  📞 Call Duration    : $CALL_DURATION"
        echo "│  📋 Response Code    : $CODE"
        echo "│"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Now query the actual data from blockchain
echo "📦 Querying blockchain data..."
echo ""

# Use peer CLI to get transaction details
docker exec cli peer chaincode query \
    -C carbonchannel \
    -n carboncc \
    -c '{"function":"queryAllCertificates","Args":[]}' 2>/dev/null | \
    jq ".[] | select(.Record | tostring | contains(\"$TXID\"))" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Blockchain query not available or transaction data not in current state"
fi

echo ""
echo "✅ Query Complete"