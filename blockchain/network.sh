#!/bin/bash
set -euo pipefail

# ===============================
# Konfigurasi dasar
# ===============================
export COMPOSE_FILE=./docker-compose.yaml
export COMPOSE_PROJECT_NAME=carbon-market
export FABRIC_CFG_PATH=${PWD}

export CHANNEL_NAME="carbonchannel"
export CC_NAME="carboncc"
export CC_SRC_PATH_IN_CONTAINER="/opt/gopath/src/github.com/chaincode/carboncc/"

# Versi & sequence chaincode
export CC_VERSION="1.1"
export CC_SEQUENCE="1"

# TLS CA Orderer (ms p/tlscacerts)
export ORDERER_CA_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/carbon.com/orderers/orderer.carbon.com/msp/tlscacerts/tlsca.carbon.com-cert.pem"

# ===============================
# Helper umum
# ===============================

# set env peer sesuai org & index
# usage: setGlobals seller 0  -> SellerMSP peer0.seller...
#        setGlobals buyer  1  -> BuyerMSP  peer1.buyer...
function setGlobals() {
  local ORG=$1
  local PEER_INDEX=$2

  case "$ORG" in
    seller)
      CORE_PEER_LOCALMSPID="SellerMSP"
      ORG_DOMAIN="seller.carbon.com"
      if [ "$PEER_INDEX" -eq 0 ]; then PORT=7051; else PORT=8051; fi
      ;;
    buyer)
      CORE_PEER_LOCALMSPID="BuyerMSP"
      ORG_DOMAIN="buyer.carbon.com"
      if [ "$PEER_INDEX" -eq 0 ]; then PORT=9051; else PORT=10051; fi
      ;;
    regulator)
      CORE_PEER_LOCALMSPID="RegulatorMSP"
      ORG_DOMAIN="regulator.carbon.com"
      if [ "$PEER_INDEX" -eq 0 ]; then PORT=11051; else PORT=12051; fi
      ;;
    *)
      echo "ORG tidak dikenal: $ORG"; exit 1;;
  esac

  CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/users/Admin@${ORG_DOMAIN}/msp"
  CORE_PEER_ADDRESS="peer${PEER_INDEX}.${ORG_DOMAIN}:${PORT}"
  CORE_PEER_TLS_ENABLED=true
  CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG_DOMAIN}/peers/peer${PEER_INDEX}.${ORG_DOMAIN}/tls/ca.crt"

  export CORE_PEER_LOCALMSPID CORE_PEER_MSPCONFIGPATH CORE_PEER_ADDRESS CORE_PEER_TLS_ENABLED CORE_PEER_TLS_ROOTCERT_FILE
}

# eksekusi command peer di dalam container cli dengan env yang sudah diset di atas
function cliExec() {
  local CMD=$1
  docker exec cli bash -c "$CMD"
}

# retry helper: retry N kali dengan delay
function retry() {
  local MAX=$1; shift
  local SLEEP_SEC=$1; shift
  local CMD="$*"

  local ATTEMPT=1
  until [ $ATTEMPT -gt $MAX ]; do
    if eval "$CMD"; then
      return 0
    fi
    echo "Percobaan $ATTEMPT/$MAX gagal. Tunggu ${SLEEP_SEC}s…"
    sleep "$SLEEP_SEC"
    ATTEMPT=$((ATTEMPT+1))
  done
  echo "Gagal setelah $MAX percobaan: $CMD"
  return 1
}

# ===============================
# Pembersihan & bootstrap
# ===============================
function clearContainers() {
  echo "========== Menghentikan & Menghapus container lama... =========="
  docker compose -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT_NAME" down --volumes --remove-orphans || true

  # sisa container dev-peer
  local LINGER
  LINGER=$(docker ps -aq --filter "name=dev-peer" || true)
  if [ -n "$LINGER" ]; then
    docker rm -f $LINGER >/dev/null 2>&1 || true
  fi
  echo "========== Selesai menghapus kontainer lama =========="
}

function removeOldArtifacts() {
  echo "========== Menghapus artefak lama ... =========="
  rm -rf ./organizations
  rm -rf ./system-genesis-block/*
  rm -rf ./channel-artifacts/*
  rm -rf ./bin ./install-fabric.sh ./log.txt
  mkdir -p ./system-genesis-block ./channel-artifacts ./scripts
  echo "========== Artefak lama dihapus =========="
}

function downloadFabricBinaries() {
  if [ ! -d "bin" ]; then
    echo "Mengunduh Fabric binaries..."
    curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
    chmod +x install-fabric.sh
    ./install-fabric.sh binary --fabric-version 2.5.13 --ca-version 1.5.15
    echo "====== Unduhan Fabric binaries selesai ======"
  else
    echo "Binari Fabric sudah ada."
  fi
}

function generateCrypto() {
  echo "========== Membangkitkan materi kripto (cryptogen) ... =========="
  ./bin/cryptogen generate --config=./crypto-config.yaml --output="./organizations"
  echo "========== Materi kripto berhasil dibuat =========="
}

function createGenesisBlock() {
  echo "========== Membuat Genesis Block (configtxgen) ... =========="
  ./bin/configtxgen -profile CarbonOrdererGenesis \
    -channelID system-channel \
    -outputBlock ./system-genesis-block/genesis.block \
    -configPath .
  echo "========== Genesis Block dibuat =========="
}

function networkUp() {
  downloadFabricBinaries
  generateCrypto
  createGenesisBlock

  echo "========== Menjalankan Docker Compose untuk jaringan ... =========="
  docker compose -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT_NAME" up -d
  docker ps -a
  echo "Menunggu 12 detik agar orderer, peers & CouchDB siap..."
  sleep 12
  echo "========== Docker Compose up selesai =========="
}

# ===============================
# Channel lifecycle
# ===============================
function createChannel() {
  echo "========== Membuat Channel ${CHANNEL_NAME} ... =========="
  ./bin/configtxgen \
    -profile CarbonChannel \
    -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx \
    -channelID "$CHANNEL_NAME" \
    -configPath .

  # create channel pakai Admin Seller (peer0.seller)
  setGlobals seller 0
  cliExec "
    export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
    export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
    export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
    export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
    export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
    peer channel create -o orderer.carbon.com:7050 -c ${CHANNEL_NAME} \
      --ordererTLSHostnameOverride orderer.carbon.com \
      -f /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/channel-artifacts/${CHANNEL_NAME}.tx \
      --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/channel-artifacts/${CHANNEL_NAME}.block \
      --tls --cafile ${ORDERER_CA_PATH}
  "
  echo "========== Channel ${CHANNEL_NAME} berhasil dibuat =========="
  joinChannel
}

function joinChannel() {
  echo "========== Join channel untuk semua peers ... =========="

  for ORG in seller buyer regulator; do
    for PEER in 0 1; do
      setGlobals "$ORG" "$PEER"
      echo "-> ${CORE_PEER_LOCALMSPID} joining (${CORE_PEER_ADDRESS})..."
      retry 6 3 \
      "docker exec cli bash -c '
        export CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID;
        export CORE_PEER_MSPCONFIGPATH=$CORE_PEER_MSPCONFIGPATH;
        export CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS;
        export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
        export CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_TLS_ROOTCERT_FILE;
        peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/channel-artifacts/${CHANNEL_NAME}.block
      '"
    done
  done

  echo "========== Semua peer telah join channel =========="
  updateAnchorPeers
}

function updateAnchorPeers() {
  echo "========== Update Anchor Peers untuk setiap organisasi ... =========="

  for ORG in seller buyer regulator; do
    case "$ORG" in
      seller) MSP="SellerMSP"; PORT=7051;;
      buyer) MSP="BuyerMSP"; PORT=9051;;
      regulator) MSP="RegulatorMSP"; PORT=11051;;
    esac

    echo "Membuat anchor update tx untuk ${MSP}..."
    ./bin/configtxgen -profile CarbonChannel \
      -outputAnchorPeersUpdate ./channel-artifacts/${MSP}anchors.tx \
      -channelID "$CHANNEL_NAME" -asOrg "$MSP" -configPath .

    setGlobals "$ORG" 0
    echo "Mengupdate anchor peer untuk ${MSP} (peer0)..."
    cliExec "
      export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
      export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
      export CORE_PEER_ADDRESS='peer0.${ORG}.carbon.com:${PORT}';
      export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
      export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
      peer channel update -o orderer.carbon.com:7050 \
        --ordererTLSHostnameOverride orderer.carbon.com \
        -c ${CHANNEL_NAME} \
        -f /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/channel-artifacts/${MSP}anchors.tx \
        --tls --cafile ${ORDERER_CA_PATH}
    "
  done

  echo "========== Anchor peers diupdate =========="
}

# ===============================
# Chaincode lifecycle
# ===============================
function packageAndInstall() {
  echo "========== Packaging chaincode ${CC_NAME} v${CC_VERSION} ... =========="
  cliExec "peer lifecycle chaincode package ${CC_NAME}_${CC_VERSION}.tar.gz \
    --path ${CC_SRC_PATH_IN_CONTAINER} --lang node --label ${CC_NAME}_${CC_VERSION}"
  echo "Chaincode berhasil di-package."

  for ORG in seller buyer regulator; do
    for PEER in 0 1; do
      setGlobals "$ORG" "$PEER"
      echo "--- Installing on ${CORE_PEER_LOCALMSPID} ${CORE_PEER_ADDRESS} ---"
      cliExec "
        export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
        export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
        export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
        export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
        export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
        peer lifecycle chaincode install ${CC_NAME}_${CC_VERSION}.tar.gz
      "
    done
  done
  echo "========== Install selesai di semua peer =========="
}

function getPackageId() {
  echo "========== Mengambil Package ID (referensi peer0.seller) ... =========="
  setGlobals seller 0
  cliExec "
    export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
    export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
    export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
    export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
    export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
    peer lifecycle chaincode queryinstalled | tee /tmp/queryinstalled.txt
  "
  local LINE
  LINE=$(docker exec cli bash -c "grep 'Package ID: ${CC_NAME}_${CC_VERSION}:' /tmp/queryinstalled.txt | head -n1" || true)
  if [[ -z "$LINE" ]]; then
    echo "Gagal menemukan Package ID untuk label ${CC_NAME}_${CC_VERSION}"; exit 1
  fi
  PACKAGE_ID=$(echo "$LINE" | sed -E "s/Package ID: (${CC_NAME}_${CC_VERSION}:[a-f0-9]+),.*/\1/")
  echo "PACKAGE_ID = ${PACKAGE_ID}"
  echo "${PACKAGE_ID}" > .package_id
}

function approveAll() {
  echo "========== Approve chaincode untuk semua org =========="
  for ORG in seller buyer regulator; do
    setGlobals "$ORG" 0
    echo "--- Approving for ${CORE_PEER_LOCALMSPID} (${CORE_PEER_ADDRESS}) ---"
    cliExec "
      export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
      export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
      export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
      export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
      export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
      peer lifecycle chaincode approveformyorg \
        -o orderer.carbon.com:7050 \
        --ordererTLSHostnameOverride orderer.carbon.com \
        --channelID ${CHANNEL_NAME} \
        --name ${CC_NAME} \
        --version ${CC_VERSION} \
        --sequence ${CC_SEQUENCE} \
        --package-id ${PACKAGE_ID} \
        --signature-policy \"OR('SellerMSP.peer','BuyerMSP.peer','RegulatorMSP.peer')\" \
        --tls --cafile ${ORDERER_CA_PATH}
    "
  done

  echo "========== Check Commit Readiness =========="
  cliExec "
    peer lifecycle chaincode checkcommitreadiness \
      --channelID ${CHANNEL_NAME} \
      --name ${CC_NAME} \
      --version ${CC_VERSION} \
      --sequence ${CC_SEQUENCE} \
      --tls --cafile ${ORDERER_CA_PATH} \
      --output json
  "
}

function commitCC() {
  echo "========== Commit chaincode =========="
  # pakai identitas Seller admin
  setGlobals seller 0
  cliExec "
    export CORE_PEER_LOCALMSPID='$CORE_PEER_LOCALMSPID';
    export CORE_PEER_MSPCONFIGPATH='$CORE_PEER_MSPCONFIGPATH';
    export CORE_PEER_ADDRESS='$CORE_PEER_ADDRESS';
    export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED;
    export CORE_PEER_TLS_ROOTCERT_FILE='$CORE_PEER_TLS_ROOTCERT_FILE';
    peer lifecycle chaincode commit \
      -o orderer.carbon.com:7050 \
      --ordererTLSHostnameOverride orderer.carbon.com \
      --channelID ${CHANNEL_NAME} \
      --name ${CC_NAME} \
      --version ${CC_VERSION} \
      --sequence ${CC_SEQUENCE} \
      --signature-policy \"OR('SellerMSP.peer','BuyerMSP.peer','RegulatorMSP.peer')\" \
      --tls --cafile ${ORDERER_CA_PATH} \
      --peerAddresses peer0.seller.carbon.com:7051 \
      --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/seller.carbon.com/peers/peer0.seller.carbon.com/tls/ca.crt \
      --peerAddresses peer0.buyer.carbon.com:9051 \
      --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/buyer.carbon.com/peers/peer0.buyer.carbon.com/tls/ca.crt \
      --peerAddresses peer0.regulator.carbon.com:11051 \
      --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/regulator.carbon.com/peers/peer0.regulator.carbon.com/tls/ca.crt
  "

  echo "========== Verifikasi querycommitted =========="
  cliExec "
    peer lifecycle chaincode querycommitted \
      --channelID ${CHANNEL_NAME} \
      --name ${CC_NAME} \
      --tls --cafile ${ORDERER_CA_PATH}
  "
}

function deployCC() {
  echo "========== Deploy Chaincode End-to-End (v${CC_VERSION}, seq${CC_SEQUENCE}) =========="
  packageAndInstall
  getPackageId
  approveAll
  commitCC
  echo "========== Selesai: chaincode aktif di channel ${CHANNEL_NAME} =========="
}

function upgradeCC() {
  echo "========== Upgrade Chaincode ke v${CC_VERSION}, seq ${CC_SEQUENCE} =========="
  packageAndInstall
  getPackageId
  approveAll
  commitCC
  echo "========== Upgrade selesai =========="
}

# ===============================
# Entry
# ===============================
case "${1:-}" in
  restart)
    clearContainers
    removeOldArtifacts
    networkUp
    createChannel
    deployCC
    ;;
  down)
    clearContainers
    ;;
  upgrade)
    upgradeCC
    ;;
  *)
    echo "Penggunaan: ./network.sh [restart|down|upgrade]"
    exit 1
    ;;
esac
