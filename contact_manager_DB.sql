CREATE DATABASE IF NOT EXISTS CONTACT_MANAGER;
USE CONTACT_MANAGER;

-- Create users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE CONTACTS (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);


CREATE INDEX idx_CONTACTS_user_id ON contacts(user_id);
CREATE INDEX idx_CONTACTS_email ON contacts(email);
CREATE INDEX idx_CONTACTS_names ON contacts(last_name, first_name);

CREATE USER 'Adam'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON CONTACT_MANAGER.* TO 'Adam'@'localhost';
FLUSH PRIVILEGES;
