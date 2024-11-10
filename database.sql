CREATE DATABASE sensor_app;
USE sensor_app;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;

CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    heart_rate FLOAT,
    spO2 FLOAT,
    body_temp FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from sensor_data;
truncate sensor_data;









