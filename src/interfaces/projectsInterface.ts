import { QueryResult } from "pg";

interface iProjectsRequest {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
}

interface iProjects extends iProjectsRequest {
  id: number;
  endDate: Date;
}

interface iDeveloperProjects extends iProjects {
  name: string;
  email: string;
}

interface iTechnologiesRequest {
  name: string;
}

interface iTechnologies extends iTechnologiesRequest {
  id: number;
}

interface iTechnologiesComplete extends iTechnologies {
  addedIn: string;
}

type projectsResult = QueryResult<iProjects>;
type developerProjectResult = QueryResult<iDeveloperProjects>;
type technologiesResult = QueryResult<iTechnologiesComplete>;

export {
  iProjectsRequest,
  iProjects,
  projectsResult,
  developerProjectResult,
  iTechnologiesRequest,
  iTechnologies,
  iTechnologiesComplete,
  technologiesResult,
};
