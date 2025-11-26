CREATE DATABASE narrowway_traffic_db;
USE narrowway_traffic_db;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','operator') DEFAULT 'operator',
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `week_day` int(11) NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO users(username, created_by, password, role, email, phone_number, first_name) VALUES("Admin", 1, "$2y$10$0CMwVgYuz4BHqY0CtDrwS.iuYeWYH8rXSHscuaM1sBYESUAlHiTne", "admin", "admin@email.com", "09102456943", "Admin");