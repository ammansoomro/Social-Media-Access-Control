-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 09, 2022 at 02:15 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `isproj`
--

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `friendshipId` int NOT NULL,
  `fromUser` int NOT NULL,
  `toUser` int NOT NULL,
  `friendGroup` varchar(50) CHARACTER SET utf8mb4  NOT NULL DEFAULT 'friends'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`friendshipId`, `fromUser`, `toUser`, `friendGroup`) VALUES
(1, 1, 2, 'friends'),
(2, 2, 1, 'friends');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `postId` int NOT NULL,
  `posterId` int NOT NULL,
  `postPrivacy` int NOT NULL,
  `postContent` varchar(500) NOT NULL,
  `postDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`postId`, `posterId`, `postPrivacy`, `postContent`, `postDate`) VALUES
(1, 1, 1, 'Hello, this is my first post', '2021-12-09'),
(2, 1, 2, 'This is my second post', '2022-12-01'),
(3, 1, 1, 'another new post', '2022-12-03'),
(6, 2, 1, 'this is my second post', '2022-12-03'),
(9, 1, 0, 'test', '2022-12-03'),
(11, 1, 3, 'test', '2022-12-09');

-- --------------------------------------------------------

--
-- Table structure for table `privacysetting`
--

CREATE TABLE `privacysetting` (
  `settingId` int NOT NULL,
  `ACType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Dumping data for table `privacysetting`
--

INSERT INTO `privacysetting` (`settingId`, `ACType`) VALUES
(0, 'public'),
(1, 'friends'),
(2, 'closefriends'),
(3, 'bestfriends'),
(4, 'private');

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `requestId` int NOT NULL,
  `fromRequest` int NOT NULL,
  `toRequest` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int NOT NULL,
  `userName` varchar(40) NOT NULL,
  `DoB` date NOT NULL,
  `email` varchar(40) NOT NULL,
  `DoBPrivacy` int NOT NULL DEFAULT '1',
  `emailPrivacy` int NOT NULL DEFAULT '1',
  `password` varchar(50) NOT NULL,
  `friendshipPrivacy` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userName`, `DoB`, `email`, `DoBPrivacy`, `emailPrivacy`, `password`, `friendshipPrivacy`) VALUES
(1, 'ordinall', '2002-04-02', 'test@test.com', 1, 3, 'pass', 2),
(2, 'amman', '2001-12-21', 'ammansoomro@gmail.com', 2, 1, 'pass', 1),
(3, 'naba', '2012-12-06', 'asdasd@asda.com', 2, 0, 'pass', 0),
(4, 'testuser', '2002-04-01', 'test@test.com', 1, 1, 'pass', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`friendshipId`),
  ADD KEY `FromUserForeign` (`fromUser`),
  ADD KEY `ToUserForeign` (`toUser`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postId`),
  ADD KEY `posterIdForeign` (`posterId`),
  ADD KEY `postPrivacyForeign` (`postPrivacy`);

--
-- Indexes for table `privacysetting`
--
ALTER TABLE `privacysetting`
  ADD PRIMARY KEY (`settingId`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`requestId`),
  ADD KEY `fromRequestForeign` (`fromRequest`),
  ADD KEY `toRequestForeign` (`toRequest`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`,`userName`),
  ADD KEY `DoBPrivacyForeign` (`DoBPrivacy`),
  ADD KEY `EmailPrivacyForeign` (`emailPrivacy`),
  ADD KEY `FriendshipPrivacyForeign` (`friendshipPrivacy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `friendshipId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `postId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `privacysetting`
--
ALTER TABLE `privacysetting`
  MODIFY `settingId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `requestId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `FromUserForeign` FOREIGN KEY (`fromUser`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `ToUserForeign` FOREIGN KEY (`toUser`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posterIdForeign` FOREIGN KEY (`posterId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postPrivacyForeign` FOREIGN KEY (`postPrivacy`) REFERENCES `privacysetting` (`settingId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `fromRequestForeign` FOREIGN KEY (`fromRequest`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `toRequestForeign` FOREIGN KEY (`toRequest`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `DoBPrivacyForeign` FOREIGN KEY (`DoBPrivacy`) REFERENCES `privacysetting` (`settingId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `EmailPrivacyForeign` FOREIGN KEY (`emailPrivacy`) REFERENCES `privacysetting` (`settingId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FriendshipPrivacyForeign` FOREIGN KEY (`friendshipPrivacy`) REFERENCES `privacysetting` (`settingId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
