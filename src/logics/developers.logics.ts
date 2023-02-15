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
  { validatedBody }: Request,
  response: Response
): Promise<Response | void> => {
  try {
    const developerData: iDeveloper = validatedBody;

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
  try {
    const developerData: iDeveloperInfos = request.validatedInfos;
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
              "developerInfoId" = $1
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
  } catch (error: any) {
    if (error.message.includes("invalid input value for enum prefos")) {
      return response.status(400).json({
        message: "Invalid OS option. Options [Windows, Linux, MacOS]",
      });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllDevelopers = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const queryString: string = `
  SELECT 
    *
  FROM 
    developers d
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
	  developer_infos di ON d."developerInfoId" = di.id
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
    const devId: number = parseInt(request.params.id);

    const queryString: string = format(
      `
        UPDATE
            developers
        SET(%I) = ROW (%L)
        WHERE
            id = $1
        `,
      Object.keys(developerData),
      Object.values(developerData)
    );

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [devId],
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
  try {
    const developerData: iDeveloperInfos = request.body;
    const devId: number = parseInt(request.params.id);

    let queryString1: string = `
          SELECT 
            *
          FROM 
              developers de
          WHERE
              de.id = $1
          `;

    const queryConfig1: QueryConfig = {
      text: queryString1,
      values: [devId],
    };

    let queryResult: any = await client.query(queryConfig1);

    let queryString: string = format(
      `
          UPDATE
              developer_infos di
          SET(%I) = ROW(%L)
          WHERE
              di.id = $1
          RETURNING
            *;
          `,
      Object.keys(developerData),
      Object.values(developerData)
    );

    const queryConfig2: QueryConfig = {
      text: queryString,
      values: [queryResult.rows[0].developerInfoId],
    };

    const queryResult2: QueryResult = await client.query(queryConfig2);

    return response.status(200).json(queryResult2.rows[0]);
  } catch (error: any) {
    if (error.message.includes("invalid input value for enum prefos")) {
      return response.status(400).json({
        message: "Invalid OS option. Options [Windows, Linux, MacOS]",
      });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
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
