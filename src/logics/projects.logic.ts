import { Request, Response } from "express";
import format from "pg-format";
import {
  developerProjectResult,
  iProjectsRequest,
  projectsResult,
} from "../interfaces/projectsInterface";
import { client } from "../database/database";
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
    p.*,
    d.id,
    d."name",
    d.email
FROM 
    projects p 
JOIN developers d ON p."developerID" = d.id
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
      p.*,
      d.id,
      d."name",
      d.email
  FROM 
      projects p 
  JOIN developers d ON p."developerID" = d.id
  WHERE
    p.id = $1
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

  const queryString: string = format(`
    UPDATE
        projects
    SET(%I) = ROW(%L)
    WHERE
        id = $1
  `,
  Object.keys(projectKeys),
  Object.values(projectData)
  )

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id]
  }

  const queryResult: projectsResult = await client.query(queryConfig)

  return response.status(200).json(queryResult.rows[0])
  
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
          id = $1
      `;
  
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };
    await client.query(queryConfig);
    return response.status(204).send();
  };

const finishProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {};

export { createProject, listProjects, listProjectsById, updateProject, deleteProject };
