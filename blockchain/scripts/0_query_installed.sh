#!/bin/bash
set -e

# Direktori skrip ini (agar path selalu benar)
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Mencari Package ID untuk carboncc versi 1.0..."

# Ambil package ID chaincode dari peer0.seller.carbon.com
PACKAGE_ID=$(docker exec cli peer lifecycle chaincode queryinstalled \
  --output json | jq -r '.installed_chaincodes[] | select(.label=="carboncc_1.0") | .package_id')

if [ -z "$PACKAGE_ID" ]; then
  echo "Package ID tidak ditemukan!"
  exit 1
fi

echo "Package ID ditemukan: $PACKAGE_ID"

# Simpan ke file package.id di folder skrip
echo "$PACKAGE_ID" > "$DIR/package.id"

echo "File package.id berhasil dibuat di $DIR"

