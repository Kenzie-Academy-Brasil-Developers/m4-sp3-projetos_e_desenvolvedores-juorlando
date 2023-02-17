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
"developerInfoId" integer UNIQUE,
FOREIGN KEY ("developerInfoId") REFERENCES developer_infos("id")
);

CREATE TABLE IF NOT EXISTS projects(
"id" serial PRIMARY KEY,
"name" varchar(50) NOT NULL,
"description" TEXT NOT NULL,
"estimatedTime" varchar(20) NOT NULL,
"repository" varchar(120) NOT NULL,
"startDate" date NOT NULL,
"endDate" date,
"developerId" integer UNIQUE,
FOREIGN KEY ("developerId") REFERENCES developers("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects_technologies(
"id" serial PRIMARY KEY,
"addedIn" date NOT NULL,
"projectId" integer UNIQUE,
FOREIGN KEY ("projectId") REFERENCES projects("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS technologies(
"id" serial PRIMARY KEY,
"name" varchar(30) NOT NULL
);

INSERT INTO technologies("name")
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

ALTER TABLE projects_technologies 
ADD "technologyId" integer UNIQUE,
ADD FOREIGN KEY ("technologyId") REFERENCES technologies("id");




