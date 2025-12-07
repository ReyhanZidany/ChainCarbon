#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         GOSSIP PROTOCOL STATUS CHECK                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PEERS=(
    "peer0.seller.carbon.com"
    "peer1.seller.carbon.com"
    "peer0.buyer.carbon.com"
    "peer1.buyer.carbon.com"
    "peer0.regulator.carbon.com"
    "peer1.regulator.carbon.com"
)

for PEER in "${PEERS[@]}"; do
    echo "┌─ $PEER ─────────────────────────────────────────────────────"
    echo "│"
    
    # Check gossip membership
    MEMBERSHIP=$(docker logs $PEER 2>&1 | grep "Membership view has changed" | tail -5)
    
    if [ -z "$MEMBERSHIP" ]; then
        echo "│  ⚠️  No recent gossip activity"
    else
        echo "│  ✅ Gossip Active"
        echo "│"
        echo "│  Recent Membership Changes:"
        echo "$MEMBERSHIP" | while read -r line; do
            TIMESTAMP=$(echo "$line" | awk '{print $1, $2}')
            echo "│    $TIMESTAMP"
        done
    fi
    
    # Check for dead members
    DEAD=$(docker logs $PEER 2>&1 | grep "Haven't heard from" | tail -3)
    
    if [ -n "$DEAD" ]; then
        echo "│"
        echo "│  ⚠️  Dead Members Detected:"
        echo "$DEAD" | while read -r line; do
            echo "│    $(echo $line | awk '{print $1, $2}')"
        done
    fi
    
    echo "│"
    echo "└──────────────────────────────────────────────────────────────"
    echo ""
done