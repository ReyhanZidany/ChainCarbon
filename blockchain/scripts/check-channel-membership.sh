#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         CHANNEL MEMBERSHIP VERIFICATION                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PEERS=(
    "peer0.seller.carbon.com:7051:sellerMSP"
    "peer1.seller.carbon.com:8051:sellerMSP"
    "peer0.buyer.carbon.com:9051:buyerMSP"
    "peer1.buyer.carbon.com:10051:buyerMSP"
    "peer0.regulator.carbon.com:11051:regulatorMSP"
    "peer1.regulator.carbon.com:12051:regulatorMSP"
)

for PEER_INFO in "${PEERS[@]}"; do
    IFS=':' read -r PEER_HOST PEER_PORT MSP_ID <<< "$PEER_INFO"
    ORG=$(echo $MSP_ID | sed 's/MSP//' | tr '[:upper:]' '[:lower:]')
    
    echo "┌─ Checking: $PEER_HOST ─────────────────────────────────────"
    echo "│"
    
    # Check if peer joined channel
    RESULT=$(docker exec cli bash -c "
        export CORE_PEER_ADDRESS=$PEER_HOST:$PEER_PORT
        export CORE_PEER_LOCALMSPID=$MSP_ID
        export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG}.carbon.com/users/Admin@${ORG}.carbon.com/msp
        
        peer channel list 2>&1
    ")
    
    if echo "$RESULT" | grep -q "carbonchannel"; then
        echo "│  ✅ Joined carbonchannel"
        
        # Get channel info
        INFO=$(docker exec cli bash -c "
            export CORE_PEER_ADDRESS=$PEER_HOST:$PEER_PORT
            export CORE_PEER_LOCALMSPID=$MSP_ID
            export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG}.carbon.com/users/Admin@${ORG}.carbon.com/msp
            
            peer channel getinfo -c carbonchannel 2>&1
        ")
        
        BLOCK_HEIGHT=$(echo "$INFO" | grep -oP "height:\s*\K\d+" || echo "N/A")
        echo "│  📊 Block Height: $BLOCK_HEIGHT"
    else
        echo "│  ❌ NOT joined to carbonchannel"
    fi
    
    echo "│"
    echo "└──────────────────────────────────────────────────────────────"
    echo ""
done

echo "✅ Channel Membership Check Complete"