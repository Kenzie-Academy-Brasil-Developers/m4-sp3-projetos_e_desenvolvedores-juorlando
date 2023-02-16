import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database/index";
import {
  developerRequiredKeys,
  infosRequiredKeys,
} from "../interfaces/developersInterface";
import { projectRequiredKeys, iDeveloperProjects, technologiesRequiredKeys } from "../interfaces/projectsInterface"

const ensureDeveloperExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
    SELECT 
        *
    FROM 
        developers
    WHERE 
        id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return response.status(404).json({ message: "Developer not found!" });
  }

  return next();
};

const validateDataMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(request.body);
  const keyValue: Array<any> = Object.values(request.body);
  const requiredKeys: Array<developerRequiredKeys> = ["name", "email"];

  const hasRequiredKeys = keys.filter((key: any) => {
    return requiredKeys.includes(key);
  });

  const typeKey: boolean = keyValue.every((key: any) => {
    if (typeof key !== "string") {
      return response
        .status(400)
        .json({ message: "tipo do valor de entrada inválido" });
    }
  });

  if (!hasRequiredKeys.length) {
    return response
      .status(400)
      .json({ message: `Requeried keys: ${requiredKeys}` });
  }

  const validateKey = hasRequiredKeys.map((key: any) => {
    return [key, request.body[key]];
  });

  const validatedBodyData = Object.fromEntries(validateKey);

  request.validatedBody = validatedBodyData;

  return next();
};

const validateDataDevInfoMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(request.body);
  const keyValue: Array<any> = Object.values(request.body);
  const requiredKeys: Array<infosRequiredKeys> = [
    "developerSince",
    "preferredOS",
  ];

  const hasRequiredKeys = keys.filter((key: any) => {
    return requiredKeys.includes(key);
  });

  const typeKey: boolean = keyValue.every((key: any) => {
    if (typeof key !== "string") {
      return response
        .status(400)
        .json({ message: "tipo do valor de entrada inválido" });
    }
  });

  if (!hasRequiredKeys.length) {
    return response
      .status(400)
      .json({ message: `Requeried keys: ${requiredKeys}` });
  }

  const validateKey = hasRequiredKeys.map((key: any) => {
    return [key, request.body[key]];
  });

  const validatedBodyData = Object.fromEntries(validateKey);

  request.validatedInfos = validatedBodyData;

  return next();
};

const validateDataMiddlewareProjects = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(request.body);
  const keyValue: Array<string> = Object.values(request.body);
  const requiredKeys: Array<projectRequiredKeys> = ["name", "description", "estimatedTime", "repository", "startDate"];

  const hasRequiredKeys = keys.filter((key: any) => {
    return requiredKeys.includes(key);
  });

  const typeKey: boolean = keyValue.every((key: any) => {
    if (typeof key !== "string") {
      return response
        .status(400)
        .json({ message: "tipo do valor de entrada inválido" });
    }
  });

  if (!hasRequiredKeys.length) {
    return response
      .status(400)
      .json({ message: `Requeried keys: ${requiredKeys}` });
  }

  const validateKey = hasRequiredKeys.map((key: any) => {
    return [key, request.body[key]];
  });

  const validatedProjectData = Object.fromEntries(validateKey);

  request.validatedProject = validatedProjectData

  return next();
};

const validateDataMiddlewareTechnology = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(request.body);
  const keyValue: Array<string> = Object.values(request.body);
  const requiredKeys: Array<technologiesRequiredKeys> = ["name"];

  const hasRequiredKeys = keys.filter((key: any) => {
    return requiredKeys.includes(key);
  });

  const typeKey: boolean = keyValue.every((key: any) => {
    if (typeof key !== "string") {
      return response
        .status(400)
        .json({ message: "tipo do valor de entrada inválido" });
    }
  });

  if (!hasRequiredKeys.length) {
    return response
      .status(400)
      .json({ message: `Requeried keys: ${requiredKeys}` });
  }

  const validateKey = hasRequiredKeys.map((key: any) => {
    return [key, request.body[key]];
  });

  const validatedTechData = Object.fromEntries(validateKey);

  request.validatedTechonology = validatedTechData

  return next();
};

export {
  ensureDeveloperExist,
  validateDataMiddleware,
  validateDataDevInfoMiddleware,
  validateDataMiddlewareProjects,
  validateDataMiddlewareTechnology
};
