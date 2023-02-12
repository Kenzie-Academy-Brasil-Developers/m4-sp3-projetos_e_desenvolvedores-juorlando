CREATE TYPE prefOS AS ENUM ('Windows', 'Linux', 'MacOS');
CREATE TABLE IF NOT EXISTS developer_infos(
id SERIAL PRIMARY KEY,
developerSince date NOT NULL,
preferredOS prefOS NOT NULL
);

SELECT * FROM developer_infos;

CREATE TABLE IF NOT EXISTS developers(
id SERIAL PRIMARY KEY,
name varchar(50) NOT NULL,
email varchar(50) UNIQUE NOT NULL,
infoID integer UNIQUE,
FOREIGN KEY (infoID) REFERENCES developer_infos(id)
);

CREATE TABLE IF NOT EXISTS projects(
id serial PRIMARY KEY,
"name" varchar(50) NOT NULL,
"description" TEXT NOT NULL,
"estimatedTime" varchar(20) NOT NULL,
"repository" varchar(120) NOT NULL,
"startDate" date NOT NULL,
"endDate" date
);

CREATE TABLE IF NOT EXISTS technologies(
id serial PRIMARY KEY,
"name" varchar(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects_technologies(
id serial PRIMARY KEY,
"addedIn" date NOT NULL
);

INSERT INTO developers("name", "email")
VALUES ('José', 'jose@teste.com')
RETURNING *;

SELECT * FROM developers;

INSERT INTO 
developer_infos("developersince", "preferredos")
VALUES
('01/01/2022', 'Windows')
RETURNING *;
       
UPDATE
developers
SET
infoID = 1
WHERE
id = 1
RETURNING *;

SELECT * FROM developer_infos;





