import { Request, Response } from "express";
import format from "pg-format";
import {
  developerComplete,
  developerInfosResult,
  developerResult,
  iDeveloper,
  iDeveloperInfos,
  iDeveloperRequest,
} from "../interfaces/developersInterface";
import { client } from "../database/index";
import { QueryConfig, QueryResult } from "pg";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  try {
    const developerData: iDeveloper = request.body;

    const queryString: string = format(
      `
        INSERT INTO 
            developers(%I)
        VALUES
            (%L)
        RETURNING *
        `,
      Object.keys(developerData),
      Object.values(developerData)
    );

    const queryResult: developerResult = await client.query(queryString);

    return response.status(201).json(queryResult.rows[0]);
  } catch (error: any) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return response.status(409).json({ message: "Email already exists." });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

const createDeveloperInfos = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const developerData: iDeveloperInfos = request.body;
  const infoId: number = parseInt(request.params.id);

  let queryString: string = format(
    `
        INSERT INTO 
            developer_infos(%I)
        VALUES
            (%L)
        RETURNING
            *;
        `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  let queryResult: developerInfosResult = await client.query(queryString);

  queryString = `
        UPDATE
            developers
        SET
            "infoID" = $1
        WHERE
            id = $2
        RETURNING
            *;
        `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryResult.rows[0].id, infoId],
  };

  await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

const getAllDevelopers = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const queryString: string = `
  SELECT 
    d."id", 
    d."name",
    d."email",
    di."developerSince",
    di."preferredOS"
  FROM 
    developers d 
  JOIN 
    developer_infos di ON d."infoID" = di.id
  `;

  const queryResult: developerComplete = await client.query(queryString);

  return response.status(200).json(queryResult.rows);
};

const getDevelopersById = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
  SELECT 
    d."id", 
    d."name",
    d."email",
    di."developerSince",
    di."preferredOS"
  FROM 
	  developers d 
  JOIN 
	  developer_infos di ON d."infoID" = di.id
  WHERE
    d.id = $1
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: developerComplete = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const patchDeveloper = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  try {
    const developerData: iDeveloperRequest = request.body;
    const developerKeys: iDeveloperRequest = request.body;
    const id: number = parseInt(request.params.id);

    const queryString: string = format(
      `
        UPDATE
            developers
        SET(%I) = ROW (%L)
        WHERE
            "id" = $1
        `,
      Object.keys(developerKeys),
      Object.values(developerData)
    );

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResult: developerResult = await client.query(queryConfig);

    return response.status(200).json(queryResult.rows[0]);
  } catch (error: any) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return response.status(409).json({ message: "Email already exists." });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

const patchDeveloperInfos = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const developerData: iDeveloperInfos = request.body;
  const developerKeys: iDeveloperInfos = request.body;
  const id: number = parseInt(request.params.id);

  console.log(id)
  console.log(developerData)
  console.log(developerKeys)

  let queryString: string = format(
    `
        UPDATE
            developer_infos
        SET(%I) = ROW(%L)
        WHERE
            id = $1
        `,
    Object.keys(developerKeys),
    Object.values(developerData)
  );

  let queryResult: developerInfosResult = await client.query(queryString);

  queryString = `
        UPDATE
            developers
        SET
            "infoID" = $1
        WHERE
            "id" = $2
        RETURNING
            *;
        `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryResult.rows[0].id, id],
  };

  console.log(queryResult.rows[0].id, id)

  await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
    DELETE FROM
        developers
    WHERE
        "id" = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);
  return response.status(204).send();
};

export {
  createDeveloper,
  createDeveloperInfos,
  getDevelopersById,
  getAllDevelopers,
  patchDeveloper,
  patchDeveloperInfos,
  deleteDeveloper,
};
