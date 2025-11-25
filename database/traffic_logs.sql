-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 25, 2025 at 04:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `narrowway_traffic_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `traffic_logs`
--

CREATE TABLE `traffic_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `camera_id` enum('cam1','cam2') NOT NULL,
  `light_state` enum('red','green') NOT NULL,
  `mode_type` enum('manual','auto') NOT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `traffic_logs`
--

INSERT INTO `traffic_logs` (`id`, `user_id`, `camera_id`, `light_state`, `mode_type`, `duration_seconds`, `timestamp`, `notes`) VALUES
(3, 2, 'cam1', 'red', 'manual', 180, '2025-11-24 11:18:02', NULL),
(4, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 11:52:37', NULL),
(5, 2, 'cam1', 'red', 'manual', NULL, '2025-11-24 11:52:38', NULL),
(6, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 11:52:39', NULL),
(7, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 11:52:49', NULL),
(8, 2, 'cam1', 'red', 'manual', NULL, '2025-11-24 11:52:50', NULL),
(9, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:40', NULL),
(10, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:43', NULL),
(11, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:44', NULL),
(12, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:45', NULL),
(13, 2, 'cam1', 'red', 'manual', NULL, '2025-11-24 12:06:47', NULL),
(14, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:48', NULL),
(15, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:48', NULL),
(16, 2, 'cam1', 'red', 'manual', NULL, '2025-11-24 12:06:50', NULL),
(17, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:51', NULL),
(18, 2, 'cam1', 'green', 'manual', NULL, '2025-11-24 12:06:55', NULL),
(19, 2, 'cam1', 'green', 'manual', 2, '2025-11-24 12:50:48', NULL),
(20, 2, 'cam2', 'red', 'manual', 2, '2025-11-24 12:50:48', NULL),
(21, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 13:33:40', NULL),
(22, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 13:33:40', NULL),
(23, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 13:35:20', NULL),
(24, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 13:35:20', NULL),
(25, 2, 'cam1', 'green', 'manual', 2, '2025-11-24 14:15:27', NULL),
(26, 2, 'cam2', 'red', 'manual', 2, '2025-11-24 14:15:27', NULL),
(27, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 14:15:29', NULL),
(28, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 14:15:29', NULL),
(29, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:15:29', NULL),
(30, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:15:29', NULL),
(31, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:15:30', NULL),
(32, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:15:30', NULL),
(33, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:15:31', NULL),
(34, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:15:31', NULL),
(35, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:15:32', NULL),
(36, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:15:32', NULL),
(37, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:15:33', NULL),
(38, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:15:33', NULL),
(39, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:15:34', NULL),
(40, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:15:34', NULL),
(41, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:15:35', NULL),
(42, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:15:35', NULL),
(43, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 14:15:36', NULL),
(44, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 14:15:36', NULL),
(45, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:15:37', NULL),
(46, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:15:37', NULL),
(47, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 14:15:38', NULL),
(48, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 14:15:38', NULL),
(49, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:15:39', NULL),
(50, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:15:39', NULL),
(51, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 14:15:40', NULL),
(52, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 14:15:40', NULL),
(53, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:15:41', NULL),
(54, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:15:41', NULL),
(55, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:15:42', NULL),
(56, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:15:42', NULL),
(57, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:15:43', NULL),
(58, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:15:43', NULL),
(59, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:19:01', NULL),
(60, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:19:01', NULL),
(61, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:19:02', NULL),
(62, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:19:02', NULL),
(63, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:19:03', NULL),
(64, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:19:03', NULL),
(65, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:19:03', NULL),
(66, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:19:03', NULL),
(67, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:23:40', NULL),
(68, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:23:40', NULL),
(69, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:23:41', NULL),
(70, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:23:41', NULL),
(71, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:23:42', NULL),
(72, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:23:42', NULL),
(73, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:23:43', NULL),
(74, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:23:43', NULL),
(75, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:23:44', NULL),
(76, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:23:45', NULL),
(77, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:25:00', NULL),
(78, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:25:00', NULL),
(79, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:25:01', NULL),
(80, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:25:01', NULL),
(81, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:25:02', NULL),
(82, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:25:02', NULL),
(83, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:25:02', NULL),
(84, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:25:02', NULL),
(85, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:25:03', NULL),
(86, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:25:03', NULL),
(87, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:25:04', NULL),
(88, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:25:04', NULL),
(89, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:25:05', NULL),
(90, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:25:05', NULL),
(91, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:25:06', NULL),
(92, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:25:06', NULL),
(93, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:25:06', NULL),
(94, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:25:06', NULL),
(95, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:25:07', NULL),
(96, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:25:07', NULL),
(97, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:25:08', NULL),
(98, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:25:08', NULL),
(99, 2, 'cam1', 'green', 'manual', 4, '2025-11-24 14:31:07', NULL),
(100, 2, 'cam2', 'red', 'manual', 4, '2025-11-24 14:31:07', NULL),
(101, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 14:31:08', NULL),
(102, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 14:31:08', NULL),
(103, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:09', NULL),
(104, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:09', NULL),
(105, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:31:10', NULL),
(106, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:31:10', NULL),
(107, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:11', NULL),
(108, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:11', NULL),
(109, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 14:31:12', NULL),
(110, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 14:31:12', NULL),
(111, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:17', NULL),
(112, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:17', NULL),
(113, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:31:24', NULL),
(114, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:31:24', NULL),
(115, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:31:25', NULL),
(116, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:31:25', NULL),
(117, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:25', NULL),
(118, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:25', NULL),
(119, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:31:26', NULL),
(120, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:31:26', NULL),
(121, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:26', NULL),
(122, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:26', NULL),
(123, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:31:26', NULL),
(124, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:31:26', NULL),
(125, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:27', NULL),
(126, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:27', NULL),
(127, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:31:27', NULL),
(128, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:31:27', NULL),
(129, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:28', NULL),
(130, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:28', NULL),
(131, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:31:28', NULL),
(132, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:31:28', NULL),
(133, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:28', NULL),
(134, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:28', NULL),
(135, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:31:29', NULL),
(136, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:31:29', NULL),
(137, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:31:29', NULL),
(138, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:31:29', NULL),
(139, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 14:42:54', NULL),
(140, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 14:42:54', NULL),
(141, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:42:56', NULL),
(142, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:42:56', NULL),
(143, 2, 'cam1', 'red', 'manual', 2, '2025-11-24 14:42:58', NULL),
(144, 2, 'cam2', 'green', 'manual', 2, '2025-11-24 14:42:58', NULL),
(145, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:43:04', NULL),
(146, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:43:04', NULL),
(147, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:44:01', NULL),
(148, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:44:01', NULL),
(149, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:44:02', NULL),
(150, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:44:02', NULL),
(151, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:50:45', NULL),
(152, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:50:45', NULL),
(153, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 14:50:46', NULL),
(154, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 14:50:46', NULL),
(155, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 14:56:24', NULL),
(156, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 14:56:24', NULL),
(157, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 14:56:25', NULL),
(158, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 14:56:25', NULL),
(159, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 15:07:06', NULL),
(160, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 15:07:06', NULL),
(161, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 15:07:07', NULL),
(162, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 15:07:07', NULL),
(163, 2, 'cam1', 'red', 'manual', 32, '2025-11-24 15:07:40', NULL),
(165, 2, 'cam1', 'red', 'manual', 38, '2025-11-24 15:08:18', NULL),
(166, 2, 'cam2', 'green', 'manual', 38, '2025-11-24 15:08:18', NULL),
(167, 2, 'cam1', 'red', 'manual', 12, '2025-11-24 15:14:45', NULL),
(168, 2, 'cam2', 'green', 'manual', 12, '2025-11-24 15:14:45', NULL),
(169, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 15:14:47', NULL),
(170, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 15:14:47', NULL),
(171, 2, 'cam1', 'red', 'manual', 5, '2025-11-24 15:14:52', NULL),
(173, 2, 'cam2', 'green', 'manual', 2, '2025-11-24 15:16:19', NULL),
(174, 2, 'cam1', 'red', 'manual', 2, '2025-11-24 15:16:19', NULL),
(175, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 15:21:07', NULL),
(176, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 15:21:07', NULL),
(177, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 15:21:07', NULL),
(178, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 15:21:07', NULL),
(179, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 15:21:08', NULL),
(180, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 15:21:08', NULL),
(181, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 15:58:18', NULL),
(182, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 15:58:18', NULL),
(183, 2, 'cam1', 'green', 'auto', 31, '2025-11-24 16:08:01', NULL),
(184, 2, 'cam2', 'red', 'auto', 31, '2025-11-24 16:08:01', NULL),
(185, 2, 'cam1', 'red', 'auto', 31, '2025-11-24 16:08:32', NULL),
(186, 2, 'cam2', 'green', 'auto', 31, '2025-11-24 16:08:32', NULL),
(187, 2, 'cam1', 'red', 'manual', 3, '2025-11-24 16:09:16', NULL),
(188, 2, 'cam2', 'green', 'manual', 3, '2025-11-24 16:09:16', NULL),
(189, 2, 'cam1', 'green', 'manual', 1, '2025-11-24 16:09:18', NULL),
(190, 2, 'cam2', 'red', 'manual', 1, '2025-11-24 16:09:18', NULL),
(191, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 16:09:18', NULL),
(192, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 16:09:18', NULL),
(193, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 16:09:18', NULL),
(194, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 16:09:18', NULL),
(195, 2, 'cam1', 'red', 'manual', 0, '2025-11-24 16:09:18', NULL),
(196, 2, 'cam2', 'green', 'manual', 0, '2025-11-24 16:09:18', NULL),
(197, 2, 'cam1', 'green', 'manual', 0, '2025-11-24 16:09:18', NULL),
(198, 2, 'cam2', 'red', 'manual', 0, '2025-11-24 16:09:18', NULL),
(203, 2, 'cam1', 'red', 'manual', 1, '2025-11-24 16:09:20', NULL),
(204, 2, 'cam2', 'green', 'manual', 1, '2025-11-24 16:09:20', NULL),
(205, 2, 'cam1', 'green', 'manual', 8, '2025-11-24 16:09:28', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `traffic_logs`
--
ALTER TABLE `traffic_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_timestamp` (`timestamp`),
  ADD KEY `idx_user_camera` (`user_id`,`camera_id`),
  ADD KEY `idx_light_state` (`light_state`),
  ADD KEY `idx_mode_type` (`mode_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `traffic_logs`
--
ALTER TABLE `traffic_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `traffic_logs`
--
ALTER TABLE `traffic_logs`
  ADD CONSTRAINT `traffic_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
