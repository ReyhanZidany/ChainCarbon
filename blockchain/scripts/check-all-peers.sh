#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║      MULTI-PEER TRANSACTION VERIFICATION                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "👤 User: ReyhanZidany"
echo "⏰ Time: $(date '+%Y-%m-%d %H:%M:%S') UTC"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Define all peers
PEERS=(
    "peer0.seller.carbon.com"
    "peer1.seller.carbon.com"
    "peer0.buyer.carbon.com"
    "peer1.buyer.carbon.com"
    "peer0.regulator.carbon.com"
    "peer1.regulator.carbon.com"
)

TOTAL_CHECKED=0
TOTAL_TRANSACTIONS=0

# Loop through all peers
for PEER in "${PEERS[@]}"; do
    echo "┌─ Checking: $PEER ─────────────────────────────────────────────"
    echo "│"
    
    # Check if peer is running
    if ! docker ps | grep -q "$PEER"; then
        echo "│  ❌ Status: OFFLINE"
        echo "│"
        echo "└──────────────────────────────────────────────────────────────────"
        echo ""
        continue
    fi
    
    echo "│  ✅ Status: ONLINE"
    
    # Count transactions
    TX_COUNT=$(docker logs $PEER 2>&1 | grep -c "endorser.*callChaincode.*finished")
    TOTAL_TRANSACTIONS=$((TOTAL_TRANSACTIONS + TX_COUNT))
    TOTAL_CHECKED=$((TOTAL_CHECKED + 1))
    
    echo "│  📊 Transactions: $TX_COUNT"
    
    # Get latest transaction
    LATEST_TX=$(docker logs $PEER 2>&1 | grep "endorser.*callChaincode.*finished" | tail -1)
    
    if [ -n "$LATEST_TX" ]; then
        LATEST_TXID=$(echo "$LATEST_TX" | grep -oP "txID=\K\w+" || echo "N/A")
        LATEST_TIME=$(echo "$LATEST_TX" | awk '{print $1, $2}')
        LATEST_DURATION=$(echo "$LATEST_TX" | grep -oP "duration:\s*\K\d+ms" || echo "N/A")
        
        echo "│  🕐 Latest TX Time: $LATEST_TIME"
        echo "│  🆔 Latest TX ID: $LATEST_TXID"
        echo "│  ⏱️  Duration: $LATEST_DURATION"
    else
        echo "│  ⚠️  No transactions found"
    fi
    
    echo "│"
    echo "└──────────────────────────────────────────────────────────────────"
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 SUMMARY"
echo "├─ Total Peers Checked   : $TOTAL_CHECKED / ${#PEERS[@]}"
echo "├─ Total Transactions    : $TOTAL_TRANSACTIONS"
echo "└─ Average per Peer      : $((TOTAL_TRANSACTIONS / TOTAL_CHECKED))"
echo ""
echo "✅ Verification Complete"
echo ""