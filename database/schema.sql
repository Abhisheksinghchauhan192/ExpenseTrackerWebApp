CREATE DATABASE IF NOT EXISTS myexpenses;
USE myexpenses; 


-- query to create expenses table 
-- this will contain all the info about a expense

CREATE TABLE `expenses` (
  `expenseid` int NOT NULL AUTO_INCREMENT,
  `Date` date NOT NULL,
  `Amount` double NOT NULL,
  `Category` varchar(50) NOT NULL,
  `Merchant` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`expenseid`)
);


-- query to create users table.. 
-- contain the user logins data 

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`email`)
);


