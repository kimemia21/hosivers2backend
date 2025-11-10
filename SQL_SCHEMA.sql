-- =========================================
-- HOSPITAL RECORDS MANAGEMENT SYSTEM
-- Database Schema for MySQL 8.x
-- =========================================

-- =========================================
-- 1. USERS TABLE
-- Stores all system users with authentication
-- =========================================
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'pharmacist', 'receptionist') NOT NULL DEFAULT 'receptionist',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 2. DEPARTMENTS TABLE
-- Hospital departments/units
-- =========================================
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 3. DOCTORS TABLE
-- Healthcare provider profiles
-- =========================================
CREATE TABLE doctors (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  department_id INT,
  license_number VARCHAR(100),
  specialization VARCHAR(150),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  
  INDEX idx_user_id (user_id),
  INDEX idx_department_id (department_id),
  INDEX idx_license_number (license_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 4. PATIENTS TABLE
-- Patient demographics and medical information
-- =========================================
CREATE TABLE patients (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(150) NOT NULL,
  last_name VARCHAR(150) NOT NULL,
  dob DATE,
  gender ENUM('male', 'female', 'other') DEFAULT 'other',
  national_id VARCHAR(100), -- Consider encrypting in production
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(50),
  allergies TEXT,
  known_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  INDEX idx_name (first_name, last_name),
  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 5. INVENTORY TABLE
-- Medications and supplies with batch tracking
-- =========================================
CREATE TABLE inventory (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  batch_number VARCHAR(100),
  expiry_date DATE,
  unit VARCHAR(50),
  quantity INT DEFAULT 0,
  location VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_sku (sku),
  INDEX idx_name (name),
  INDEX idx_expiry_date (expiry_date),
  INDEX idx_batch_number (batch_number),
  INDEX idx_quantity (quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 6. PRESCRIPTIONS TABLE
-- Prescription headers
-- =========================================
CREATE TABLE prescriptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT NOT NULL,
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  
  INDEX idx_patient_id (patient_id),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_status (status),
  INDEX idx_issue_date (issue_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 7. PRESCRIPTION ITEMS TABLE
-- Line items for prescriptions
-- =========================================
CREATE TABLE prescription_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  prescription_id BIGINT NOT NULL,
  inventory_id BIGINT,
  med_name VARCHAR(255) NOT NULL,
  dose VARCHAR(100),
  frequency VARCHAR(100),
  route VARCHAR(100),
  quantity INT,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE SET NULL,
  
  INDEX idx_prescription_id (prescription_id),
  INDEX idx_inventory_id (inventory_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 8. AUDIT LOGS TABLE
-- Audit trail for compliance
-- =========================================
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(50) NOT NULL,
  object_type VARCHAR(50),
  object_id BIGINT,
  changes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_object_type (object_type),
  INDEX idx_object_id (object_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
