-- Grant root access from Docker network
GRANT ALL PRIVILEGES ON hospital_db.* TO 'root'@'%';
FLUSH PRIVILEGES;

-- Rest of your setup script...
CREATE DATABASE IF NOT EXISTS hospital_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'hospital_user'@'%' IDENTIFIED BY 'hospital_pass';
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'%';
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'localhost';

FLUSH PRIVILEGES;

USE hospital_db;

SELECT 'Database initialized successfully' AS message;