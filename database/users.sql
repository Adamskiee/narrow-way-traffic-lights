-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 26, 2025 at 09:52 AM
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
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `created_by`, `password`, `role`, `email`, `phone_number`, `first_name`, `last_name`, `created_at`) VALUES
(2, 'admin', 2, '$2y$10$0CMwVgYuz4BHqY0CtDrwS.iuYeWYH8rXSHscuaM1sBYESUAlHiTne', 'admin', '', '', '', NULL, '2025-11-13 14:20:27'),
(4, 'operator', 2, '$2y$10$A6PzdC0Oa/AgmUv.Wg3L8OQ.x61gefoLNdFtWV8jcMRjjiSC0Ya3.', 'operator', 'operator421@gmail.com', '', 'OperatorEdit122112122', '', '2025-11-26 06:09:46'),
(5, 'operator1', 2, '$2y$10$K8U49OhReJjOOLCyP.yBReoSNECJ600r1SMYAS0lh3g7aLEq9PqaC', 'operator', 'operator1@gmail.com', '09123456789', 'Operator1Edit', '', '2025-11-14 11:30:10'),
(6, 'Operator3', 2, '$2y$10$36Ld1xlhnJmTngUrXzR7POTMd/0eqPowjN1AU2DwSF2xVlwc0.BG.', 'operator', 'operator3@gmail.com', '09123456782', 'Operator3', '', '2025-11-14 07:32:21'),
(11, 'Adam', 2, '$2y$10$6blQAQW2MLKs0UBdIf/gL../AWrEQa3bT/YvPkLjx5PWS/tW0PQCq', 'operator', 'toisnomatthew@gmail.com', '09108412802', 'Adriele', 'Tosino', '2025-11-15 10:16:59'),
(25, 'Test', 25, '$2a$10$TTVGR.KlzIuPhZJ.Fn29qOH7.hh8h.NK/SXzWIzk0m7p/aqiXHSeq', 'admin', 'test@gmail.com', '09108412809', 'Test', NULL, '2025-11-16 13:56:31'),
(100, 'admin2', 100, '$2a$10$RJa3YrF89z/Wnuor7OyMyug.4b89jZnfIOWJ4MBo.PA3v5C0EmfKG', 'admin', 'admin2@gmail.com', '09102434542', 'Admin2', NULL, '2025-11-19 08:13:16'),
(105, 'admin1232', 2, '$2y$10$azFJzIrkhhcT.MuXR3fLw.axKRYcOL/D8LZLjFv5FS/hNQWZajn4W', 'operator', 'tosinomatthew@gmail.com', '09123456782', 'OperatorEdit12211212321', 'Anonymous', '2025-11-24 08:52:59'),
(107, 'adam2414112asfas', 2, '$2y$10$b8bBmvEeXSqWUU50UjJjXumXkaHkvgZURWbwwdX7aIU8kf.MRpVlK', 'operator', 'operator1@gmail.com', '09562438645', 'OperatorEdit12211212321', 'Anonymous', '2025-11-24 08:53:51'),
(108, 'operator241', 2, '$2y$10$UplnvXteu89JgpRgvfqwzeImnT5mtKZ65no4YZe8mVKLQLBOwVWZK', 'operator', 'lorstosino15@gmail.com', '09562438645', 'OperatorEdit12211212321', 'Anonymous', '2025-11-24 08:55:31'),
(109, 'operator4125', 2, '$2y$10$OwKj0ksMZ/LJbgexUKrKpetKSTn7vSqo5wI9ip/P3L9usgTF/y.AW', 'operator', 'operator42@gmail.com', '09123456782', 'OperatorEdit12211212321', 'Anonymous', '2025-11-24 08:59:21'),
(110, 'adam12312', 2, '$2y$10$PXN7L0CT6/wZ/b2dgjK7KOThCUtm/9FkTJEqi7Fl34vmQr931MR0q', 'operator', 'operator1@gmail.com', '09123456782', 'Operator1', '', '2025-11-26 05:36:51'),
(111, 'adam122', 2, '$2y$10$xppg9E4tw1XASPVT/xUII.ZwQTMi78qUnBHwfmTkvn8Rcm4pSJ0JK', 'operator', 'tosinomatthew@gmail.com', '09562438645', 'OperatorEdit12211212321', 'asdf', '2025-11-26 05:37:19'),
(112, 'adam1234124', 2, '$2y$10$hQ4oD7nHd7mMwPuvE0Yh/e3ux60vPT/xIzpQBhms//xTbwbAzPZlG', 'operator', 'operator42@gmail.com', '09123456782', 'Operator1', 'asdf', '2025-11-26 05:43:36'),
(114, 'adam12412sdafs', 2, '$2y$10$kw43kS1SGPpwuvQFmx5XE.ukiWjqQSsr2J3tYixThbDsfhmcYzjb.', 'operator', 'operator1@gmail.com', '09123456789', 'OperatorEdit12211212321', 'asdf', '2025-11-26 05:45:37'),
(115, 'adam1212', 2, '$2y$10$DVzlZzmAFvFIqB2E1Ml1zOFbV8WAtiRQvyGn9HcasG3sJn8bsSDq2', 'operator', 'operator42@gmail.com', '09123456789', 'OperatorEdit12211212321', 'asdf', '2025-11-26 05:45:49'),
(117, 'User122421221', 2, '$2y$10$qq2zbsCHAwWxUs1Slf3Ybu2C8Qjo2KsmjWWIGcDIdQ.gkrzjZM1g.', 'operator', 'operator42@gmail.com', '09123456789', 'OperatorEdit12211212321', 'asdf', '2025-11-26 05:46:31'),
(119, '12saddfasf', 2, '$2y$10$g39tmEsBZrpmcFDFlrPuUevOu3dnXMMfqJ3nEgkI6Xx57Nznp8Duy', 'operator', 'operator1@gmail.com', '09123456789', 'Operator', 'asdf', '2025-11-26 05:48:36'),
(120, 'adam1212fsadfasdf', 2, '$2y$10$7F7WF/fx1TlYpWApZJzNtuOX5Z.gKtqzqgmtq0OsbAe.HTC9eywtC', 'operator', 'operator42@gmail.com', '09123456782', 'Operator', 'asdf', '2025-11-26 05:48:52'),
(121, 'asadfsadf', 2, '$2y$10$R1mag7nTJVzptF8fo.JQl.BJ63cpzp7a./noI0PMq7p.zkro5e3si', 'operator', 'tosinomatthew@gmail.com', 'asdfasf', 'asfasfasdfaf', 'asdfasfd', '2025-11-26 05:57:05'),
(122, 'adamasfsadfasfd12adgf', 2, '$2y$10$PiOoBJ8CGeV2qiS.Dyo2VuCggAP7M3Ms.cQ4dHQrGve7szupX4EbS', 'operator', 'lorstosino15@gmail.com', 'asdfasf', 'OperatorEdit12211212321', 'asdf', '2025-11-26 05:57:31'),
(123, 'asdfasdf12412asdf', 2, '$2y$10$VF4rpF.p4eP/2ex0yHLSpeusS9rnZ.ve2jOSvl/nvtQ0Z4aUoDhG6', 'operator', 'operator42@gmail.com', '', 'asfasfasdfaf', 'asdf', '2025-11-26 06:04:16'),
(124, 'User1asdfsafcasdfraw2asdf', 2, '$2y$10$Piu9NWGwzdT6ebKYbyVheePu5GFO4aP6CfNf7Q59lurcBvxFizEz2', 'operator', 'operator1@gmail.com', '', 'Operator', 'asdf', '2025-11-26 06:04:33'),
(125, 'asdfafasdf', 2, '$2y$10$/SOcm2cM4ES/LiHYVaSHa.SOXrBU01vXYKCuwGcAbS1oktd/2zEL6', 'operator', 'tosinomatthew@gmail.com', '', 'OperatorEdit12211212321', '', '2025-11-26 06:04:59'),
(126, 'asdfasfd124asdf', 2, '$2y$10$K1aIz.LvL/.NQCahkVB/oeco38nwAOaBVUn16lKvUA7YbteYsAEsa', 'operator', 'operator42@gmail.com', '', 'OperatorEdit12211212321', '', '2025-11-26 06:05:08'),
(127, 'adam12312412', 2, '$2y$10$W/80Fs5fI2tRxX9isZSX0uKmnPUuxYD2jCOVj7IQUJLKiig9OlhTm', 'operator', 'lorstosino15@gmail.com', '', 'OperatorEdit12211212321', '', '2025-11-26 06:08:46'),
(128, 'asdf1234124asfsaf12', 2, '$2y$10$JkHVXAUVx2bGxA/LzzZQ/evPZbL4f.1wdfpIy/D2i8AEvOaV8wHwC', 'operator', 'operator42@gmail.com', '', 'OperatorEdit122112123211142', '', '2025-11-26 06:09:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
