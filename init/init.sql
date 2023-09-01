SET SESSION FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `rock_paper_scissors` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `rock_paper_scissors`;

CREATE TABLE IF NOT EXISTS `user` (
    user_id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(256) NOT NULL,
    email varchar(256) NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY (email)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `game` (
    game_id VARCHAR(16) NOT NULL,
    player1 INT NOT NULL,
    player2 INT DEFAULT NULL,
    game_state VARCHAR(32) NOT NULL,
    winner INT DEFAULT NULL,
    started_at DATETIME DEFAULT NULL,
    finished_at DATETIME DEFAULT NULL,
    PRIMARY KEY (game_id),
    FOREIGN KEY (player1) REFERENCES `user` (user_id),
    FOREIGN KEY (player2) REFERENCES `user` (user_id),
    FOREIGN KEY (winner) REFERENCES `user` (user_id)
) ENGINE = InnoDB;
