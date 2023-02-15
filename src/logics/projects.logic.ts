import { Request, Response } from "express";
import format from "pg-format";
import {
  developerProjectResult,
  iProjectsRequest,
  iTechnologiesRequest,
  projectsResult,
  technologiesResult,
} from "../interfaces/projectsInterface";
import { client } from "../database/index";
import { QueryConfig } from "pg";

const createProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const projectData: iProjectsRequest = request.body;

  const queryString = format(
    `
    INSERT INTO
        projects(%I)
    VALUES(%L)
    RETURNING
        *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: projectsResult = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const listProjects = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const queryString: string = `
  SELECT 
*
  FROM 
    projects 
    `;

  const queryResult: developerProjectResult = await client.query(queryString);

  return response.status(200).json(queryResult.rows);
};

const listProjectsById = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
  SELECT 
  p."name" projeto,
  p.description,
  p."estimatedTime",
  p.repository,
  p."startDate",
  d.id,
  d."name" desenvolvedor,
  d.email,
  pt."addedIn"
  FROM 
    projects p 
    JOIN developers d ON p."developerId" = d.id
    JOIN projects_technologies pt ON pt."projectId" = p.id 
  WHERE
    "developerId" = $1
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: developerProjectResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const updateProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
  const projectData: iProjectsRequest = request.body;
  const projectKeys: iProjectsRequest = request.body;

  const queryString: string = format(
    `
    UPDATE
        projects
    SET(%I) = ROW(%L)
    WHERE
        "developerId" = $1
  `,
    Object.keys(projectKeys),
    Object.values(projectData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: projectsResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
      DELETE FROM
          projects
      WHERE
          "developerId" = $1
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);
  return response.status(204).send();
};

const createTechnologies = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const technologieData: iTechnologiesRequest = request.body;
  const projectsID: number = parseInt(request.params.id);

  let queryString: string = format(
    `
            INSERT INTO 
                projects_technologies(%I)
            VALUES
                (%L)
            RETURNING
                *;
            `,
    Object.keys(technologieData),
    Object.values(technologieData)
  );

  let queryResult: technologiesResult = await client.query(queryString);

  queryString = `
            UPDATE
                technologies
            WHERE
                id = $1
            RETURNING
                *;
            `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryResult.rows[0].id, projectsID],
  };

  await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

const deleteTechnologies = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
  const name: string = request.params.name;

  const queryString: string = `
      DELETE FROM
          technologies
      WHERE
          id = $1
      AND
          name = $2
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, name.toLowerCase()],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};

export {
  createProject,
  listProjects,
  listProjectsById,
  updateProject,
  deleteProject,
  createTechnologies,
  deleteTechnologies,
};
