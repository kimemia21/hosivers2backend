#!/bin/bash

# Quick Start Script - For restarting the server after initial setup
# For first-time setup, use ./setup.sh instead

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Hospital Records Management System - Quick Start${NC}\n"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file not found. Please run ./setup.sh first${NC}"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | grep -v '^[[:space:]]*$' | xargs)

echo "Select startup mode:"
echo "1) Development mode (with auto-reload)"
echo "2) Production mode"
echo "3) Docker (full stack)"
echo "4) Docker (MySQL only) + Local app"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}Starting in development mode...${NC}"
        npm run dev
        ;;
    2)
        echo -e "${GREEN}Starting in production mode...${NC}"
        npm start
        ;;
    3)
        echo -e "${GREEN}Starting with Docker Compose...${NC}"
        if docker compose version >/dev/null 2>&1; then
            docker compose up -d
            echo -e "${GREEN}✓ Services started!${NC}"
            echo -e "View logs: ${BLUE}docker compose logs -f app${NC}"
        else
            docker-compose up -d
            echo -e "${GREEN}✓ Services started!${NC}"
            echo -e "View logs: ${BLUE}docker-compose logs -f app${NC}"
        fi
        ;;
    4)
        echo -e "${GREEN}Starting MySQL in Docker...${NC}"
        if docker compose version >/dev/null 2>&1; then
            docker compose up -d mysql
        else
            docker-compose up -d mysql
        fi
        echo "Waiting for MySQL to be ready..."
        sleep 5
        echo -e "${GREEN}Starting application locally...${NC}"
        npm run dev
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
