import { QueryResult } from "pg"

interface iDeveloperRequest {
    name: string,
    email: string
}

interface iDeveloper extends iDeveloperRequest {
    id: number
}

interface iDeveloperInfosRequest {
    developersince: string,
    preferredos: string
}

interface iDeveloperInfos extends iDeveloperInfosRequest {
    id: number
}

type developerResult = QueryResult<iDeveloper>
type developerInfosResult = QueryResult<iDeveloperInfos>
type developerCompleteInfos = iDeveloper & iDeveloperInfosRequest
type developerComplete = QueryResult<developerCompleteInfos>

export { iDeveloper, developerResult , iDeveloperInfos, developerInfosResult, developerComplete, iDeveloperRequest}