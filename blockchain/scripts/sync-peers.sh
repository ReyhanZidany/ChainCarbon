#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         FORCE PEER SYNCHRONIZATION                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  This will restart peers to force re-sync"
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# Identify lagging peers
LAGGING_PEERS=(
    "peer1.buyer.carbon.com"
    "peer1.regulator.carbon.com"
)

for PEER in "${LAGGING_PEERS[@]}"; do
    echo "🔄 Restarting $PEER..."
    docker restart $PEER
    
    echo "⏳ Waiting for peer to restart..."
    sleep 5
    
    # Check if peer is back online
    if docker ps | grep -q "$PEER"; then
        echo "✅ $PEER restarted successfully"
    else
        echo "❌ $PEER failed to restart"
    fi
    
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏳ Waiting 30 seconds for gossip sync..."
sleep 30

echo ""
echo "🔍 Checking sync status..."
./scripts/check-all-peers.sh