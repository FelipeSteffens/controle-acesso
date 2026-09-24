create database desi_20252;

use desi_20252;

create table users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL, 
    email VARCHAR(150) NOT NULL,
    password_hash varchar(255) NOT NULL,
    role ENUM("admin", "user") NOT NULL DEFAULT "user"
);

create table materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL, 
    category VARCHAR(150) NOT NULL
);