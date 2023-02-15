import { QueryResult } from "pg";

interface iDeveloperRequest {
  name: string;
  email: string;
}

interface iDeveloper extends iDeveloperRequest {
  id: number;
}

interface iDeveloperInfosRequest {
  developerSince: string;
  preferredOS: string;
}

interface iDeveloperInfos extends iDeveloperInfosRequest {
  id: number;
}

type developerResult = QueryResult<iDeveloper>;
type developerInfosResult = QueryResult<iDeveloperInfos>;
type developerCompleteInfos = iDeveloper & iDeveloperInfosRequest;
type developerComplete = QueryResult<developerCompleteInfos>;
type developerRequiredKeys = "name" | "email";
type infosRequiredKeys = "developerSince" | "preferredOS";

export {
  iDeveloper,
  developerResult,
  iDeveloperInfos,
  developerInfosResult,
  developerComplete,
  iDeveloperRequest,
  developerRequiredKeys,
  infosRequiredKeys,
};
