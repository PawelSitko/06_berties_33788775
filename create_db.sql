-- Create database if not exists
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price FLOAT
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first VARCHAR(50),
    last VARCHAR(50),
    email VARCHAR(100),
    username VARCHAR(255),
    password VARCHAR(255)
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    status VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
