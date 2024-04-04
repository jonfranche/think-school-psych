CREATE TABLE stories(
    pk BIGSERIAL NOT NULL PRIMARY KEY,
    id uuid DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    userid INT NOT NULL,
    text TEXT NOT NULL
);

CREATE TABLE users(
    pk BIGSERIAL NOT NULL PRIMARY KEY,
    id uuid NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    joindate DATE NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL
);

CREATE TABLE comments(
    pk BIGSERIAL NOT NULL PRIMARY KEY,
    id uuid NOT NULL,
    userpk INT NOT NULL,
    storypk INT NOT NULL,
    date DATE NOT NULL,
    text TEXT NOT NULL
);