# Hospital Records Management System - Setup Script (PowerShell)
# This script sets up and starts the server on Windows

$ErrorActionPreference = "Stop"

# Function to print colored messages
function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Header {
    param([string]$Message)
    Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan
}

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Function to check MySQL connection
function Test-MySQL {
    param(
        [string]$Host,
        [string]$Port,
        [string]$User,
        [string]$Pass
    )
    
    try {
        $output = & mysql -h"$Host" -P"$Port" -u"$User" -p"$Pass" -e "SELECT 1;" 2>&1
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

# Function to wait for MySQL
function Wait-ForMySQL {
    param(
        [string]$Host,
        [string]$Port,
        [string]$User,
        [string]$Pass
    )
    
    Print-Info "Waiting for MySQL to be ready..."
    $maxAttempts = 30
    $attempt = 1
    
    while ($attempt -le $maxAttempts) {
        if (Test-MySQL -Host $Host -Port $Port -User $User -Pass $Pass) {
            Print-Success "MySQL is ready!"
            return $true
        }
        
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $attempt++
    }
    
    Print-Error "MySQL is not responding after $maxAttempts attempts"
    return $false
}

# Main setup function
function Main {
    Print-Header "Hospital Records Management System - Setup"
    
    # Check Node.js
    Print-Info "Checking prerequisites..."
    if (-not (Test-Command "node")) {
        Print-Error "Node.js is not installed. Please install Node.js 14+ from https://nodejs.org/"
        exit 1
    }
    $nodeVersion = node --version
    Print-Success "Node.js found: $nodeVersion"
    
    # Check npm
    if (-not (Test-Command "npm")) {
        Print-Error "npm is not installed. Please install npm."
        exit 1
    }
    $npmVersion = npm --version
    Print-Success "npm found: $npmVersion"
    
    # Check for .env file
    Print-Info "Checking environment configuration..."
    if (-not (Test-Path ".env")) {
        Print-Warning ".env file not found. Creating from .env.example..."
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Print-Success "Created .env file from .env.example"
            Print-Warning "Please update .env with your configuration before proceeding."
            Print-Info "Press Enter to continue after updating .env..."
            Read-Host
        }
        else {
            Print-Error ".env.example file not found!"
            exit 1
        }
    }
    else {
        Print-Success ".env file found"
    }
    
    # Load environment variables
    if (Test-Path ".env") {
        Get-Content ".env" | ForEach-Object {
            if ($_ -match "^\s*([^#][^=]*)\s*=\s*(.*)\s*$") {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
    
    # Set defaults
    $dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
    $dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "3306" }
    $dbUser = if ($env:DB_USER) { $env:DB_USER } else { "hospital_user" }
    $dbPass = if ($env:DB_PASS) { $env:DB_PASS } else { "hospital_pass" }
    $dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "hospital_db" }
    
    # Install dependencies
    Print-Header "Installing Dependencies"
    if (-not (Test-Path "node_modules")) {
        Print-Info "Installing npm packages..."
        npm install
        Print-Success "Dependencies installed successfully"
    }
    else {
        Print-Info "node_modules exists. Running npm install to ensure everything is up to date..."
        npm install
        Print-Success "Dependencies verified"
    }
    
    # Setup options
    Print-Header "Setup Options"
    Write-Host "Please select a setup option:"
    Write-Host "1) Full setup with Docker (Recommended - includes MySQL)"
    Write-Host "2) Local setup (requires existing MySQL server)"
    Write-Host "3) Skip database setup (start server only)"
    Write-Host ""
    $setupChoice = Read-Host "Enter your choice (1-3)"
    
    switch ($setupChoice) {
        "1" {
            Print-Header "Docker Setup"
            
            # Check Docker
            if (-not (Test-Command "docker")) {
                Print-Error "Docker is not installed. Please install Docker from https://www.docker.com/"
                exit 1
            }
            $dockerVersion = docker --version
            Print-Success "Docker found: $dockerVersion"
            
            # Check Docker Compose
            $hasDockerCompose = Test-Command "docker-compose"
            $hasDockerComposeV2 = $false
            try {
                docker compose version 2>&1 | Out-Null
                $hasDockerComposeV2 = $LASTEXITCODE -eq 0
            }
            catch {
                $hasDockerComposeV2 = $false
            }
            
            if (-not $hasDockerCompose -and -not $hasDockerComposeV2) {
                Print-Error "Docker Compose is not installed. Please install Docker Compose."
                exit 1
            }
            Print-Success "Docker Compose found"
            
            Print-Info "Starting services with Docker Compose..."
            if ($hasDockerComposeV2) {
                docker compose up -d
            }
            else {
                docker-compose up -d
            }
            
            Print-Success "Docker containers started successfully!"
            Print-Info "Application will be available at http://localhost:4000"
            Print-Info ""
            Print-Info "Useful commands:"
            Print-Info "  View logs: docker compose logs -f app"
            Print-Info "  Stop services: docker compose down"
            Print-Info "  Restart services: docker compose restart"
        }
        
        "2" {
            Print-Header "Local Setup"
            
            # Check MySQL connection
            Print-Info "Checking MySQL connection..."
            if (-not (Test-Command "mysql")) {
                Print-Warning "MySQL client not found. Attempting to connect anyway..."
            }
            
            # Try to connect
            if (-not (Test-MySQL -Host $dbHost -Port $dbPort -User $dbUser -Pass $dbPass)) {
                Print-Warning "Cannot connect to MySQL server at ${dbHost}:${dbPort}"
                Write-Host ""
                Write-Host "Options:"
                Write-Host "1) Start MySQL with Docker (recommended)"
                Write-Host "2) I'll start MySQL manually"
                $mysqlChoice = Read-Host "Enter your choice (1-2)"
                
                if ($mysqlChoice -eq "1") {
                    Print-Info "Starting MySQL container..."
                    try {
                        docker compose version 2>&1 | Out-Null
                        if ($LASTEXITCODE -eq 0) {
                            docker compose up -d mysql
                        }
                        else {
                            docker-compose up -d mysql
                        }
                    }
                    catch {
                        docker-compose up -d mysql
                    }
                    
                    if (-not (Wait-ForMySQL -Host $dbHost -Port $dbPort -User $dbUser -Pass $dbPass)) {
                        Print-Error "Failed to start MySQL. Please check your Docker setup."
                        exit 1
                    }
                }
                else {
                    Print-Info "Waiting for you to start MySQL..."
                    Print-Info "Press Enter when MySQL is ready..."
                    Read-Host
                    
                    if (-not (Wait-ForMySQL -Host $dbHost -Port $dbPort -User $dbUser -Pass $dbPass)) {
                        Print-Error "Cannot connect to MySQL. Please check your configuration."
                        exit 1
                    }
                }
            }
            else {
                Print-Success "MySQL connection successful"
            }
            
            # Run migrations
            Print-Header "Database Migration"
            Print-Info "Running database migrations..."
            npm run migrate:latest
            Print-Success "Migrations completed"
            
            # Seed database
            Write-Host ""
            $seedChoice = Read-Host "Do you want to seed the database with sample data? (y/N)"
            if ($seedChoice -match "^[Yy]$") {
                Print-Info "Seeding database..."
                npm run seed:run
                Print-Success "Database seeded successfully"
            }
            
            # Start server
            Print-Header "Starting Server"
            Write-Host "How would you like to start the server?"
            Write-Host "1) Development mode (with auto-reload)"
            Write-Host "2) Production mode"
            $startChoice = Read-Host "Enter your choice (1-2)"
            
            if ($startChoice -eq "1") {
                Print-Info "Starting server in development mode..."
                npm run dev
            }
            else {
                Print-Info "Starting server in production mode..."
                npm start
            }
        }
        
        "3" {
            Print-Header "Starting Server"
            Write-Host "How would you like to start the server?"
            Write-Host "1) Development mode (with auto-reload)"
            Write-Host "2) Production mode"
            $startChoice = Read-Host "Enter your choice (1-2)"
            
            if ($startChoice -eq "1") {
                Print-Info "Starting server in development mode..."
                npm run dev
            }
            else {
                Print-Info "Starting server in production mode..."
                npm start
            }
        }
        
        default {
            Print-Error "Invalid choice. Exiting."
            exit 1
        }
    }
}

# Run main function
try {
    Main
}
catch {
    Print-Error "An error occurred: $_"
    exit 1
}
