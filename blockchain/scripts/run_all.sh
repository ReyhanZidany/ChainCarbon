#!/bin/bash
set -e  # kalau ada error, langsung berhenti

echo "========== Query installed chaincode =========="
./0_query_installed.sh

echo "========== Approve chaincode Seller =========="
./1_approve_seller.sh

echo "========== Approve chaincode Buyer =========="
./2_approve_buyer.sh

echo "========== Approve chaincode Regulator =========="
./3_approve_regulator.sh

echo "========== Commit chaincode =========="
./4_commit.sh

echo "========== Semua skrip selesai dijalankan =========="
