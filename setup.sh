#!/bin/bash

# Hospital Records Management System - Setup Script
# This script sets up and starts the server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if MySQL is running
check_mysql() {
    if command_exists mysql; then
        if mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASS}" -e "SELECT 1;" >/dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Function to wait for MySQL to be ready
wait_for_mysql() {
    print_info "Waiting for MySQL to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if check_mysql; then
            print_success "MySQL is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "MySQL is not responding after $max_attempts attempts"
    return 1
}

# Main setup function
main() {
    print_header "Hospital Records Management System - Setup"
    
    # Check Node.js
    print_info "Checking prerequisites..."
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 14+ from https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js found: $(node --version)"
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    print_success "npm found: $(npm --version)"
    
    # Check for .env file
    print_info "Checking environment configuration..."
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
            print_warning "Please update .env with your configuration before proceeding."
            print_info "Press Enter to continue after updating .env, or Ctrl+C to exit..."
            read -r
        else
            print_error ".env.example file not found!"
            exit 1
        fi
    else
        print_success ".env file found"
    fi
    
    # Load environment variables
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | grep -v '^[[:space:]]*$' | xargs)
    fi
    
    # Set defaults if not set
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-3306}
    DB_USER=${DB_USER:-hospital_user}
    DB_PASS=${DB_PASS:-hospital_pass}
    DB_NAME=${DB_NAME:-hospital_db}
    
    # Install dependencies
    print_header "Installing Dependencies"
    if [ ! -d "node_modules" ]; then
        print_info "Installing npm packages..."
        npm install
        print_success "Dependencies installed successfully"
    else
        print_info "node_modules exists. Running npm install to ensure everything is up to date..."
        npm install
        print_success "Dependencies verified"
    fi
    
    # Setup options
    print_header "Setup Options"
    echo "Please select a setup option:"
    echo "1) Full setup with Docker (Recommended - includes MySQL)"
    echo "2) Local setup (requires existing MySQL server)"
    echo "3) Skip database setup (start server only)"
    echo ""
    read -p "Enter your choice (1-3): " setup_choice
    
    case $setup_choice in
        1)
            print_header "Docker Setup"
            
            # Check Docker
            if ! command_exists docker; then
                print_error "Docker is not installed. Please install Docker from https://www.docker.com/"
                exit 1
            fi
            print_success "Docker found: $(docker --version)"
            
            # Check Docker Compose
            if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
                print_error "Docker Compose is not installed. Please install Docker Compose."
                exit 1
            fi
            print_success "Docker Compose found"
            
            print_info "Starting services with Docker Compose..."
            if docker compose version >/dev/null 2>&1; then
                docker compose up -d
            else
                docker-compose up -d
            fi
            
            print_success "Docker containers started successfully!"
            print_info "Application will be available at http://localhost:4000"
            print_info ""
            print_info "Useful commands:"
            print_info "  View logs: docker compose logs -f app"
            print_info "  Stop services: docker compose down"
            print_info "  Restart services: docker compose restart"
            ;;
            
        2)
            print_header "Local Setup"
            
            # Check MySQL connection
            print_info "Checking MySQL connection..."
            if ! command_exists mysql; then
                print_warning "MySQL client not found. Attempting to connect anyway..."
            fi
            
            # Try to connect or start MySQL with Docker
            if ! check_mysql; then
                print_warning "Cannot connect to MySQL server at ${DB_HOST}:${DB_PORT}"
                echo ""
                echo "Options:"
                echo "1) Start MySQL with Docker (recommended)"
                echo "2) I'll start MySQL manually"
                read -p "Enter your choice (1-2): " mysql_choice
                
                if [ "$mysql_choice" = "1" ]; then
                    print_info "Starting MySQL container..."
                    if docker compose version >/dev/null 2>&1; then
                        docker compose up -d mysql
                    else
                        docker-compose up -d mysql
                    fi
                    
                    if ! wait_for_mysql; then
                        print_error "Failed to start MySQL. Please check your Docker setup."
                        exit 1
                    fi
                else
                    print_info "Waiting for you to start MySQL..."
                    print_info "Press Enter when MySQL is ready..."
                    read -r
                    
                    if ! wait_for_mysql; then
                        print_error "Cannot connect to MySQL. Please check your configuration."
                        exit 1
                    fi
                fi
            else
                print_success "MySQL connection successful"
            fi
            
            # Run migrations
            print_header "Database Migration"
            print_info "Running database migrations..."
            npm run migrate:latest
            print_success "Migrations completed"
            
            # Seed database
            echo ""
            read -p "Do you want to seed the database with sample data? (y/N): " seed_choice
            if [[ $seed_choice =~ ^[Yy]$ ]]; then
                print_info "Seeding database..."
                npm run seed:run
                print_success "Database seeded successfully"
            fi
            
            # Start server
            print_header "Starting Server"
            echo "How would you like to start the server?"
            echo "1) Development mode (with auto-reload)"
            echo "2) Production mode"
            read -p "Enter your choice (1-2): " start_choice
            
            if [ "$start_choice" = "1" ]; then
                print_info "Starting server in development mode..."
                npm run dev
            else
                print_info "Starting server in production mode..."
                npm start
            fi
            ;;
            
        3)
            print_header "Starting Server"
            echo "How would you like to start the server?"
            echo "1) Development mode (with auto-reload)"
            echo "2) Production mode"
            read -p "Enter your choice (1-2): " start_choice
            
            if [ "$start_choice" = "1" ]; then
                print_info "Starting server in development mode..."
                npm run dev
            else
                print_info "Starting server in production mode..."
                npm start
            fi
            ;;
            
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
}

# Trap Ctrl+C and exit gracefully
trap 'echo -e "\n${YELLOW}Setup interrupted by user${NC}"; exit 130' INT

# Run main function
main
