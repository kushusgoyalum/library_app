CREATE DATABASE users_app;
USE users_app;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  phone_number VARCHAR (10),
  created DATETIME NOT NULL
);

INSERT INTO users (username, email, `password`, phone_number)
VALUES 
('kush', 'lkg@gmail.com', 'password', 1234567890)