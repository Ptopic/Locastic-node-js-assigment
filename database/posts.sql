-- Posts table

CREATE TABLE IF NOT EXISTS posts(
	id INT(255) NOT NULL AUTO_INCREMENT,
	ownerId LONGTEXT NOT NULL,
    title LONGTEXT NOT NULL,
    content LONGTEXT NOT NULL,
    timeStamp DATETIME NOT NULL DEFAULT NOW(),
    author LONGTEXT NOT NULL,
    allowed ENUM('allowed', 'denied') DEFAULT 'denied',
    PRIMARY KEY(id)
);

-- Insert post

INSERT INTO posts
(ownerId, title, content, author) 
VALUES (21312, "title", "content", "author");

-- Select all posts

SELECT * FROM posts