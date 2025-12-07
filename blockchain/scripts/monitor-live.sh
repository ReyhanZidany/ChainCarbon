#!/bin/bash

PEER_NAME="peer0.seller.carbon.com"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         REAL-TIME TRANSACTION MONITOR                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Monitoring: $PEER_NAME"
echo "⏰ Started: $(date '+%Y-%m-%d %H:%M:%S')"
echo "🔴 Live Mode - Press Ctrl+C to stop"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Follow logs in real-time
docker logs -f --tail 0 $PEER_NAME 2>&1 | while IFS= read -r line; do
    # Check for ProcessProposal (transaction received)
    if echo "$line" | grep -q "ProcessProposal"; then
        TIMESTAMP=$(echo "$line" | awk '{print $1, $2}')
        echo "┌─────────────────────────────────────────────────────────────"
        echo "│ 🔵 NEW TRANSACTION RECEIVED"
        echo "│ ⏰ Time: $TIMESTAMP"
        
    # Check for chaincode execution
    elif echo "$line" | grep -q "endorser.*callChaincode.*finished"; then
        TXID=$(echo "$line" | grep -oP "txID=\K\w+" || echo "N/A")
        DURATION=$(echo "$line" | grep -oP "duration:\s*\K\d+ms" || echo "N/A")
        CHANNEL=$(echo "$line" | grep -oP "channel=\K\w+" || echo "N/A")
        CHAINCODE=$(echo "$line" | grep -oP "chaincode:\s*\K\w+" || echo "N/A")
        
        # Status emoji based on duration
        DURATION_NUM=$(echo "$DURATION" | grep -oP "\d+")
        if [ "$DURATION_NUM" -lt 5 ]; then
            STATUS="🟢"
        elif [ "$DURATION_NUM" -lt 15 ]; then
            STATUS="🟡"
        else
            STATUS="🔴"
        fi
        
        echo "│"
        echo "│ 🆔 TX ID      : $TXID"
        echo "│ 📡 Channel    : $CHANNEL"
        echo "│ 🔗 Chaincode  : $CHAINCODE"
        echo "│ ⏱️  Duration   : $DURATION $STATUS"
        echo "│ ✅ Status     : COMPLETED"
        echo "└─────────────────────────────────────────────────────────────"
        echo ""
        
        # Optional: Play sound on transaction (requires 'beep' or 'paplay')
        # beep 2>/dev/null || true
    fi
done