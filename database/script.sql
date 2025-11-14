CREATE DATABASE narrowway_traffic_db;
USE narrowway_traffic_db;

CREATE TABLE users (
  id AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  created_by int(11) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role enum('admin','operator') DEFAULT 'operator',
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) 

INSERT INTO users(username, created_by, password, role, email, phone_number, first_name) VALUES("Admin", 1, "$2y$10$0CMwVgYuz4BHqY0CtDrwS.iuYeWYH8rXSHscuaM1sBYESUAlHiTne", "admin", "admin@email.com", "09102456943", "Admin");