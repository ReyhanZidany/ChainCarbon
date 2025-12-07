#!/bin/bash

PEER_NAME="peer0.seller.carbon.com"
HOURS=${1:-24}

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         TRANSACTION STATISTICS DASHBOARD                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Analyzing last $HOURS hours"
echo "⏰ Generated: $(date '+%Y-%m-%d %H:%M:%S UTC')"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get all transactions
LOGS=$(docker logs $PEER_NAME 2>&1 | grep -E "endorser.*callChaincode.*finished")

# Count total transactions
TOTAL=$(echo "$LOGS" | wc -l)

# Calculate average duration
AVG_DURATION=$(echo "$LOGS" | grep -oP "duration:\s*\K\d+" | awk '{sum+=$1; count++} END {if(count>0) print int(sum/count); else print 0}')

# Count fast, normal, slow
FAST=$(echo "$LOGS" | grep -oP "duration:\s*\K\d+" | awk '$1 < 5 {count++} END {print count+0}')
NORMAL=$(echo "$LOGS" | grep -oP "duration:\s*\K\d+" | awk '$1 >= 5 && $1 < 15 {count++} END {print count+0}')
SLOW=$(echo "$LOGS" | grep -oP "duration:\s*\K\d+" | awk '$1 >= 15 {count++} END {print count+0}')

# Get latest transaction
LATEST_TX=$(echo "$LOGS" | tail -1 | grep -oP "txID=\K\w+")
LATEST_TIME=$(echo "$LOGS" | tail -1 | awk '{print $1, $2}')

echo "📈 SUMMARY"
echo "├─ Total Transactions    : $TOTAL"
echo "├─ Average Duration      : ${AVG_DURATION}ms"
echo "├─ Fast (<5ms)           : $FAST ($(awk "BEGIN {printf \"%.1f\", ($FAST/$TOTAL)*100}")%)"
echo "├─ Normal (5-15ms)       : $NORMAL ($(awk "BEGIN {printf \"%.1f\", ($NORMAL/$TOTAL)*100}")%)"
echo "└─ Slow (>15ms)          : $SLOW ($(awk "BEGIN {printf \"%.1f\", ($SLOW/$TOTAL)*100}")%)"
echo ""

echo "🕐 LATEST TRANSACTION"
echo "├─ TX ID                 : $LATEST_TX"
echo "└─ Timestamp             : $LATEST_TIME"
echo ""

echo "📊 TRANSACTION TIMELINE (Last 10)"
echo ""
echo "$LOGS" | tail -10 | while IFS= read -r line; do
    TIMESTAMP=$(echo "$line" | awk '{print $1, $2}')
    TXID=$(echo "$line" | grep -oP "txID=\K\w+")
    DURATION=$(echo "$line" | grep -oP "duration:\s*\K\d+")
    
    # Create duration bar
    BAR_LENGTH=$((DURATION / 2))
    BAR=$(printf '█%.0s' $(seq 1 $BAR_LENGTH))
    
    printf "  %s  %s  %3dms  %s\n" "${TIMESTAMP:11:8}" "$TXID" "$DURATION" "$BAR"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔄 To refresh: $0 $HOURS"
echo "📝 For details: ./scripts/query-tx-details.sh <TX_ID>"
echo ""