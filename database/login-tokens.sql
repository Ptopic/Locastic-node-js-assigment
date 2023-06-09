-- Login tokens table

CREATE TABLE IF NOT EXISTS loginTokens(
	uid VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    ownerId LONGTEXT NOT NULL,
    token LONGTEXT NOT NULL,
    PRIMARY KEY(uid),
    UNIQUE(uid)
);

-- Insert Login token

INSERT INTO loginTokens
(uid, createdAt, ownerId, token) 
VALUES ("23232", NOW(), "321312", "3213215413412421");

-- Select all Login tokens

SELECT * FROM loginTokens