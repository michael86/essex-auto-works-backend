-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2025 at 07:26 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `essex-auto-works`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `vehicle_reg` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `full_name`, `phone`, `email`, `address`, `created_at`, `vehicle_reg`) VALUES
('0bbe08c5-505a-11f0-98a9-00d8612e8c27', 'John Smith', '07700900001', 'john.smith@example.com', '123 Main Street, Essex', '2025-06-23 17:46:52', NULL),
('0bbe1747-505a-11f0-98a9-00d8612e8c27', 'Sarah Taylor', '07700900002', 'sarah.taylor@example.com', '45 Station Road, Basildon', '2025-06-23 17:46:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `customer_id` char(36) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `invoice_number` varchar(20) NOT NULL,
  `issue_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `customer_id`, `user_id`, `invoice_number`, `issue_date`, `due_date`, `subtotal`, `tax`, `total`, `notes`, `created_at`) VALUES
('0bbf1498-505a-11f0-98a9-00d8612e8c27', '0bbe08c5-505a-11f0-98a9-00d8612e8c27', NULL, 'INV-0001', '2025-06-01', '2025-06-15', '200.00', '40.00', '240.00', 'Full service and oil change', '2025-06-23 17:46:52'),
('0bbf247b-505a-11f0-98a9-00d8612e8c27', '0bbe1747-505a-11f0-98a9-00d8612e8c27', NULL, 'INV-0002', '2025-06-02', '2025-06-16', '150.00', '30.00', '180.00', 'Brake pad replacement', '2025-06-23 17:46:52');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `invoice_id` char(36) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `description`, `quantity`, `unit_price`, `total_price`) VALUES
('0bbfcce3-505a-11f0-98a9-00d8612e8c27', '0bbf1498-505a-11f0-98a9-00d8612e8c27', 'Engine oil change', 1, '50.00', '50.00'),
('0bbfdb2d-505a-11f0-98a9-00d8612e8c27', '0bbf1498-505a-11f0-98a9-00d8612e8c27', 'Labour - 2 hours', 2, '75.00', '150.00'),
('0bbfdb95-505a-11f0-98a9-00d8612e8c27', '0bbf247b-505a-11f0-98a9-00d8612e8c27', 'Brake pads (front)', 1, '80.00', '80.00'),
('0bbfdbd7-505a-11f0-98a9-00d8612e8c27', '0bbf247b-505a-11f0-98a9-00d8612e8c27', 'Labour - 1 hour', 1, '70.00', '70.00');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `default_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `type` enum('email_verification','password_reset') NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','staff') DEFAULT 'staff',
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password_hash`, `role`, `email_verified`, `created_at`) VALUES
('5e433499-5e93-11f0-a0d3-00d8612e8c27', 'Michael', 'Hodgson', 'michael8t6@gmail.com', '$2b$10$xXb8ib18XKDI1hH1MbXucOgyM/NSeZYnQ8.IYye9mGT6LfvYk8mpS', 'staff', 1, '2025-07-11 20:12:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
