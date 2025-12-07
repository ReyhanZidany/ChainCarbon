#!/bin/bash

PEER_NAME="peer0.seller.carbon.com"
OUTPUT_FILE="transaction-logs-$(date +%Y%m%d-%H%M%S).json"

echo "Exporting transaction logs to JSON..."

docker logs $PEER_NAME 2>&1 | grep -E "endorser.*callChaincode.*finished" | \
awk '{
    # Extract timestamp
    timestamp = $1 " " $2
    
    # Extract TX ID
    match($0, /txID=([a-f0-9]+)/, txid)
    
    # Extract duration
    match($0, /duration: ([0-9]+ms)/, duration)
    
    # Extract channel
    match($0, /channel=([a-zA-Z0-9]+)/, channel)
    
    # Extract chaincode
    match($0, /chaincode: ([a-zA-Z0-9]+)/, chaincode)
    
    # Print JSON
    printf "{\n"
    printf "  \"timestamp\": \"%s\",\n", timestamp
    printf "  \"txId\": \"%s\",\n", txid[1]
    printf "  \"channel\": \"%s\",\n", channel[1]
    printf "  \"chaincode\": \"%s\",\n", chaincode[1]
    printf "  \"duration\": \"%s\",\n", duration[1]
    printf "  \"status\": \"completed\"\n"
    printf "},\n"
}' | sed '$ s/,$//' | sed '1s/^/[\n/' | sed '$a]' > "$OUTPUT_FILE"

echo "✅ Export complete: $OUTPUT_FILE"
echo ""
echo "View with: cat $OUTPUT_FILE | jq '.'"
echo "Or import to your dashboard"