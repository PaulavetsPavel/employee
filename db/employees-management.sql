-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июн 10 2025 г., 06:37
-- Версия сервера: 8.0.36
-- Версия PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `employees-management`
--

-- --------------------------------------------------------

--
-- Структура таблицы `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `birth_date` date DEFAULT NULL,
  `position` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hire_date` date NOT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `photo_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `status` enum('работает','в отпуске','в декрете','уволен','командировка') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'работает',
  `contract_end` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `employees`
--

INSERT INTO `employees` (`id`, `name`, `birth_date`, `position`, `hire_date`, `salary`, `photo_url`, `created_by`, `status`, `contract_end`) VALUES
(1, 'Иванов Иван Иванович', '1980-06-11', 'Директор', '2025-01-27', 10000.00, '/uploads/employee-1749454312365-647773329.jpg', 1, 'работает', '2027-06-01'),
(2, 'Петров Петр Петрович', '1985-01-01', 'Бухгалтер', '2025-01-26', 7000.00, '', 1, 'в отпуске', '2027-01-26'),
(3, 'Сидорова Мария Ивановна', '2005-05-20', 'Менеджер', '2025-02-01', 5000.00, '/uploads/employee-1749454433280-523700951.png', 1, 'в декрете', '2028-02-01'),
(4, 'Павловец Павел Викторович', '1984-06-14', 'Программист', '2025-05-30', 6000.00, '/uploads/employee-1749535117373-827249026.jpg', 1, 'командировка', '2026-05-31');

-- --------------------------------------------------------

--
-- Структура таблицы `logs`
--

CREATE TABLE `logs` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `action` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `logs`
--

INSERT INTO `logs` (`id`, `user_id`, `action`, `timestamp`) VALUES
(1, 1, 'Added new employee with ID 2', '2025-02-20 09:29:18'),
(2, 1, 'Added new employee with ID 3', '2025-02-20 09:32:30'),
(3, 1, 'Added new employee with ID 4', '2025-06-07 10:00:57'),
(4, 1, 'Updated employee with ID 3', '2025-06-09 05:56:23'),
(5, 1, 'Updated employee with ID 1', '2025-06-09 05:57:07'),
(6, 1, 'Updated employee with ID 1', '2025-06-09 05:57:48'),
(7, 1, 'Updated employee with ID 1', '2025-06-09 05:58:51'),
(8, 1, 'Updated employee with ID 1', '2025-06-09 06:12:36'),
(9, 1, 'Updated employee with ID 1', '2025-06-09 06:14:03'),
(10, 1, 'Updated employee with ID 1', '2025-06-09 06:26:08'),
(11, 1, 'Updated employee with ID 3', '2025-06-09 06:26:19'),
(12, 1, 'Updated employee with ID 4', '2025-06-09 06:26:34'),
(13, 1, 'Updated employee with ID 1', '2025-06-09 07:31:52'),
(14, 1, 'Updated employee with ID 4', '2025-06-09 07:32:19'),
(15, 1, 'Updated employee with ID 2', '2025-06-09 07:33:27'),
(16, 1, 'Updated employee with ID 3', '2025-06-09 07:33:53'),
(17, 1, 'Updated employee with ID 4', '2025-06-09 07:34:10'),
(18, 1, 'Updated employee with ID 2', '2025-06-09 07:37:58'),
(19, 1, 'Updated employee with ID 2', '2025-06-09 07:40:30'),
(20, 1, 'Updated employee with ID 2', '2025-06-09 07:41:31'),
(21, 1, 'Updated employee with ID 2', '2025-06-09 07:42:11'),
(22, 1, 'Updated employee with ID 2', '2025-06-09 07:43:10'),
(23, 1, 'Updated employee with ID 2', '2025-06-09 07:49:57'),
(24, 1, 'Updated employee with ID 2', '2025-06-09 07:50:40'),
(25, 1, 'Updated employee with ID 2', '2025-06-09 07:53:59'),
(26, 1, 'Updated employee with ID 4', '2025-06-10 05:58:37');

-- --------------------------------------------------------

--
-- Структура таблицы `tokens`
--

CREATE TABLE `tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `refresh_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `refresh_token`) VALUES
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJwYXNzd29yZF9oYXNoIjoiJDJiJDA0JC5zczFXVlVJNkpHN0U0ZTdicTJ0MGVKb2V6ZXFJSmJKNUx0MEhwQUJJTGU1Ym9pbjBOejdXIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ5NTM3MTQ0LCJleHAiOjE3NTIxMjkxNDR9.f-v7ksVEml8NlT-Xe25W3EyThEmvMNejBO5g168Oszs');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`) VALUES
(1, 'admin@admin.com', '$2b$04$.ss1WVUI6JG7E4e7bq2t0eJoezeqIJbJ5Lt0HpABILe5boin0Nz7W', 'admin'),
(2, 'user@user.com', '$2b$04$ExbxYJt6LB9Q.icL9FfsX.9SgvERm9cRtR4Lkxr1hA9YI6pA1VJaa', 'user');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Индексы таблицы `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT для таблицы `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
