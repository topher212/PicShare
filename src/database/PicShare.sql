CREATE DATABASE IF NOT EXISTS PicShare;
USE PicShare;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(512) NOT NULL,
    name VARCHAR(100),
    avatar VARCHAR(100),
    active BOOLEAN DEFAULT false,
    role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
    deleted BOOLEAN DEFAULT false,
    lastAuthUpdate DATETIME
);

CREATE TABLE entries (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    place VARCHAR(100),
    description VARCHAR(250) NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE photos (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    photo VARCHAR(100) NOT NULL,
    entry_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (entry_id) REFERENCES entries(id)
);

CREATE TABLE likes (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    entry_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (entry_id) REFERENCES entries(id),
    UNIQUE (user_id, entry_id)
);

CREATE TABLE comments (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    comment TEXT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edit_date DATETIME,
	user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    entry_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (entry_id) REFERENCES entries(id)
);


INSERT INTO users (email, name, password, role) VALUES ('lili@mail.com','lili',SHA2(12345,512), 'admin');

INSERT INTO users (email, name, password, role) VALUES ('esteban@mail.com','esteban',SHA2(12345,512), 'admin');

INSERT INTO users (email, name, password, role) VALUES ('david@mail.com','david',SHA2(12345,512), 'admin');

INSERT INTO users (email, name, password, role) VALUES ('cristopher@mail.com','cristopher',SHA2(12345,512), 'admin');
