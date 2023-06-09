-- Auth tokens table

CREATE TABLE IF NOT EXISTS authTokens(
	uid VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    ownerId VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    PRIMARY KEY(uid),
    UNIQUE(uid)
);

-- Insert auth token

INSERT INTO authTokens
(uid, createdAt, ownerId, token) 
VALUES ("23232", NOW(), "321312", "3213215413412421");

-- Select all auth tokens

SELECT * FROM authTokens