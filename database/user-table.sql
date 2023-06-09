-- Create user table

CREATE TABLE IF NOT EXISTS users(
	uid VARCHAR(255) NOT NULL,
    isVerified BOOLEAN NOT NULL DEFAULT false,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'BLOGGER') DEFAULT 'USER',
    PRIMARY KEY(uid),
    UNIQUE(email)
);

-- Insert user

INSERT INTO users
(uid, email, password, firstName, lastName) 
VALUES ("23232", "pero@gmail.com", "password", "petar", "topic");


-- Select all users

SELECT * FROM users