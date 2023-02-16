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
  try {
    const projectData: iProjectsRequest = request.validatedProject;

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
  } catch (error: any) {
    if (
      error.message.includes(
        `insert or update on table "projects" violates foreign key constraint "projects_developerId_fkey`
      )
    ) {
      return response.status(404).json({ message: "Developer not found." });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

const listProjects = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const queryString: string = `
  SELECT 
*
  FROM 
    projects;
    `;

  const queryResult: developerProjectResult = await client.query(queryString);

  return response.status(200).json(queryResult.rows);
};

const listProjectsById = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const devId: number = parseInt(request.params.id);

  const queryString: string = `

  SELECT
    d.name "DonodoProjeto",
    p.name "nameProject",
    p."description",
    p."estimatedTime",
    p."repository",
    p."startDate",
    pt."addedIn",
    t.name "nameTechnology"
  FROM
    developers d
  INNER JOIN projects p
      ON p."developerId" = d.id
  INNER JOIN projects_technologies pt
      ON p.id = pt."projectId"
  INNER JOIN technologies t
      ON pt."technologyId" = t.id
  WHERE
      p."developerId" = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devId],
  };

  const queryResult: developerProjectResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const updateProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
  const projectData: iProjectsRequest = request.validatedProject;

  const queryString: string = format(
    `
    UPDATE
        projects
    SET(%I) = ROW(%L)
    WHERE
        "developerId" = $1
    RETURNING *
  `,
    Object.keys(projectData),
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
  try {
    const technologieData: iTechnologiesRequest = request.validatedTechonology;
    const projectsID: number = parseInt(request.params.id);

    let queryString: string = format(
      `
              INSERT INTO 
                  technologies(%I)
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
                  projects_technologies
              SET 
              "technologyId" = $1
              WHERE
                  id = $2
              RETURNING
                  *;
              `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [queryResult.rows[0].id, projectsID],
    };

    await client.query(queryConfig);

    return response.status(201).json(queryResult.rows[0]);
  } catch (error: any) {
    if (error.message.includes("invalid input value for enum prefos")) {
      return response.status(400).json({
        message:
          "Invalid OS option. Options [JavaScript, Python, React, Express.js, HTML, CSS, Django, PostgreSQL MongoDB]",
      });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
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
