import { QueryResult } from "pg"

interface iProjectsRequest {
name: string, 
description: string, 
estimatedTime: string,
repository: string, 
startDate: Date
}

interface iProjects extends iProjectsRequest {
    id: number,
    endDate: Date
}

interface iDeveloperProjects extends iProjects {
    name: string,
    email: string
}

type projectsResult = QueryResult<iProjects>
type developerProjectResult = QueryResult<iDeveloperProjects>

export { iProjectsRequest, iProjects, projectsResult, developerProjectResult}