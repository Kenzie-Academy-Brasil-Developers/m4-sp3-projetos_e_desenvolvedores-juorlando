import { QueryResult } from "pg"

interface iDeveloperRequest {
    name: string,
    email: string
}

interface iDeveloper extends iDeveloperRequest {
    id: number
}

type developerResult = QueryResult<iDeveloper>

export { iDeveloper, developerResult }