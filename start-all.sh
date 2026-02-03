#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fix for Docker Desktop context issues
unset DOCKER_HOST

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════╗"
echo "║   🌍 ChainCarbon Full Stack Startup  ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}Current User: ReyhanZidany${NC}"
echo -e "${YELLOW}Date: 2025-10-08 06:42:14${NC}"
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# 1. Check LAMPP/MySQL
echo -e "${YELLOW}[1/5] Checking LAMPP (MySQL)...${NC}"
if sudo /opt/lampp/lampp status | grep -q "MySQL is running"; then
    echo -e "${GREEN}✅ MySQL (LAMPP) is already running${NC}"
else
    echo -e "${CYAN}   Starting LAMPP...${NC}"
    sudo /opt/lampp/lampp start
    sleep 3
    echo -e "${GREEN}✅ LAMPP started${NC}"
fi

# 2. Start Blockchain Network
echo -e "${YELLOW}[2/5] Starting Blockchain Network (Hyperledger Fabric)...${NC}"
cd /home/reyhan-zidany/chaincarbon/blockchain

# Check if already running
if docker ps | grep -q "carbon-market"; then
    echo -e "${GREEN}✅ Blockchain network already running${NC}"
else
    echo -e "${CYAN}   Starting Docker containers...${NC}"
    docker compose -f docker-compose.yaml -p carbon-market up -d
    sleep 5
    
    # Count containers
    container_count=$(docker ps --filter "name=carbon-market" -q | wc -l)
    echo -e "${GREEN}✅ Blockchain network started (${container_count} containers)${NC}"
fi

# 3. Start Carbon API (port 3000)
echo -e "${YELLOW}[3/5] Starting Carbon API...${NC}"
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 already in use${NC}"
    echo -e "${CYAN}   Carbon API might be already running${NC}"
else
    gnome-terminal --tab --title="🔗 Carbon API" --working-directory="/home/reyhan-zidany/chaincarbon/blockchain/carbon-api" -- bash -c '
    echo "╔════════════════════════════════════╗"
    echo "║      🔗 Carbon API Server         ║"
    echo "╚════════════════════════════════════╝"
    echo ""
    echo "Starting Carbon API..."
    echo "Port: 3000"
    echo "Health: http://localhost:3000/health"
    echo ""
    node server.js
    exec bash
    '
    sleep 3
    echo -e "${GREEN}✅ Carbon API started on port 3000${NC}"
fi

# 4. Start Backend API (port 5000)
echo -e "${YELLOW}[4/5] Starting Backend API Server...${NC}"
cd /home/reyhan-zidany/chaincarbon
if check_port 5000; then
    echo -e "${RED}❌ Port 5000 is already in use${NC}"
    echo -e "${YELLOW}   To kill: sudo lsof -ti:5000 | xargs kill -9${NC}"
else
    gnome-terminal --tab --title="⚙️ Backend API" --working-directory="/home/reyhan-zidany/chaincarbon/backend" -- bash -c '
    echo "╔════════════════════════════════════╗"
    echo "║      ⚙️  Backend API Server       ║"
    echo "╚════════════════════════════════════╝"
    echo ""
    echo "Starting Backend Server..."
    echo "Port: 5000"
    echo "Database: MySQL via LAMPP"
    echo ""
    npm start
    exec bash
    '
    sleep 3
    echo -e "${GREEN}✅ Backend API started on port 5000${NC}"
fi

# 5. Start Frontend (FORCE PORT 3001)
echo -e "${YELLOW}[5/5] Starting Frontend Application...${NC}"

# Kill port 3001 if already in use
if check_port 3001; then
    echo -e "${YELLOW}   Port 3001 in use, killing process...${NC}"
    sudo kill -9 $(lsof -t -i:3001) 2>/dev/null
    sleep 1
fi

gnome-terminal --tab --title="🖥️ Frontend" --working-directory="/home/reyhan-zidany/chaincarbon/frontend" -- bash -c '
echo "╔════════════════════════════════════╗"
echo "║      🖥️  Frontend Application     ║"
echo "╚════════════════════════════════════╝"
echo ""
echo "Starting Frontend on PORT 3001..."
echo ""
PORT=3001 npm start
exec bash
'
sleep 3
echo -e "${GREEN}✅ Frontend started on port 3001${NC}"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ All Services Started Successfully!               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📍 Access Points:${NC}"
echo -e "   🖥️  Frontend:          ${GREEN}http://localhost:3001${NC}"
echo -e "   ⚙️  Backend API:       ${GREEN}http://localhost:5000${NC}"
echo -e "   🔗 Carbon API:        ${GREEN}http://localhost:3000${NC}"
echo -e "   🔗 Blockchain:        ${GREEN}Docker (carbon-market)${NC}"
echo -e "   🗄️  phpMyAdmin:       ${GREEN}http://localhost/phpmyadmin${NC}"
echo ""
echo -e "${CYAN}👤 Login Credentials:${NC}"
echo -e "   Username: ${YELLOW}ReyhanZidany${NC}"
echo -e "   Password: ${YELLOW}[your password]${NC}"
echo ""
echo -e "${CYAN}📊 Useful Commands:${NC}"
echo -e "   ${YELLOW}./status.sh${NC}      - Check all services status"
echo -e "   ${YELLOW}./stop-all.sh${NC}    - Stop all services"
echo -e "   ${YELLOW}./dev.sh${NC}         - Open development menu"
echo -e "   ${YELLOW}./blockchain.sh${NC}  - Blockchain management"
echo ""
