-- Kodbank Database Schema

-- Create KodUser table
CREATE TABLE IF NOT EXISTS KodUser (
    uid INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 100000.00,
    phone VARCHAR(20),
    role ENUM('Customer', 'Manager', 'Admin') DEFAULT 'Customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Create UserToken table
CREATE TABLE IF NOT EXISTS UserToken (
    tid INT PRIMARY KEY AUTO_INCREMENT,
    token TEXT NOT NULL,
    uid INT NOT NULL,
    expiry DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE,
    INDEX idx_uid (uid),
    INDEX idx_expiry (expiry)
);
