CREATE TYPE prefOS AS ENUM ('Windows', 'Linux', 'MacOS');
CREATE TABLE IF NOT EXISTS developer_infos(
"id" SERIAL PRIMARY KEY,
"developerSince" date NOT NULL,
"preferredOS" prefOS NOT NULL
);

SELECT * FROM developer_infos;

CREATE TABLE IF NOT EXISTS developers(
"id" SERIAL PRIMARY KEY,
"name" varchar(50) NOT NULL,
"email" varchar(50) UNIQUE NOT NULL,
"infoID" integer UNIQUE,
FOREIGN KEY ("infoID") REFERENCES developer_infos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS projects(
"id" serial PRIMARY KEY,
"name" varchar(50) NOT NULL,
"description" TEXT NOT NULL,
"estimatedTime" varchar(20) NOT NULL,
"repository" varchar(120) NOT NULL,
"startDate" date NOT NULL,
"endDate" date,
"developerID" integer UNIQUE,
FOREIGN KEY ("developerID") REFERENCES developers("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS technologies(
"id" serial PRIMARY KEY,
"name" varchar(30) NOT NULL,
"projectTechID" integer,
FOREIGN KEY ("projectTechID") REFERENCES projects_technologies("id") ON DELETE SET NULL
);

DROP TABLE technologies;

CREATE TABLE IF NOT EXISTS projects_technologies(
id serial PRIMARY KEY,
"addedIn" date NOT NULL,
"projectsID" integer NOT NULL,
FOREIGN KEY ("projectsID") REFERENCES projects("id") ON DELETE CASCADE 
);

DROP TABLE projects_technologies;

INSERT INTO developers("name", "email")
VALUES ('José', 'jose@teste.com')
RETURNING *;

SELECT * FROM developers;

INSERT INTO 
developer_infos("developerSince", "preferredOS")
VALUES
('01/01/2022', 'Windows')
RETURNING *;
       
UPDATE
developers
SET
"infoID" = 1
WHERE
"id" = 1
RETURNING *;

SELECT 
	d."id", 
	d."name",
	d."email",
	di."developerSince",
	di."preferredOS"
FROM 
	developers d 
JOIN 
	developer_infos di ON d."infoID" = di.id;

UPDATE
  developers
SET("name") = ROW ('Tonho')
WHERE
  id = 2
RETURNING *;

INSERT INTO technologies ("name")
VALUES 
('JavaScript'),
('Python'),
('React'),
('Express.js'),
('HTML'),
('CSS'),
('Django'),
('PostgreSQL'),
('MongoDB')
RETURNING 
*;

SELECT 
p."name" projeto,
p."description",
p."estimatedTime",
p."repository",
p."startDate",
d."id",
d."name" desenvolvedor,
d.email,
pt."addedIn",
t."name" technologia
FROM 
projects p 
JOIN developers d ON p."developerID" = d.id
JOIN projects_technologies pt ON pt."projectsID" = p.id 
JOIN technologies t ON t."projectTechID" = pt.id;




