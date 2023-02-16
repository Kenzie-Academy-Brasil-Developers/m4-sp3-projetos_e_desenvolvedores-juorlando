import express, { Application } from "express";
import { startDatabase } from "./database/index";
import {
  createDeveloper,
  createDeveloperInfos,
  getDevelopersById,
  getAllDevelopers,
  patchDeveloper,
  patchDeveloperInfos,
  deleteDeveloper,
} from "./logics/developers.logics";
import {
  createProject,
  listProjects,
  listProjectsById,
  updateProject,
  deleteProject,
  createTechnologies,
  deleteTechnologies,
} from "./logics/projects.logic";
import { ensureDeveloperExist, validateDataDevInfoMiddleware, validateDataMiddleware, validateDataMiddlewareProjects, validateDataMiddlewareTechnology } from "./middleware/developer.middleware";
import { ensureProjectExist } from "./middleware/projects.middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", validateDataMiddleware, createDeveloper);
app.post("/developers/:id/infos", ensureDeveloperExist, validateDataDevInfoMiddleware, createDeveloperInfos);
app.get("/developers", getAllDevelopers);
app.get("/developers/:id", ensureDeveloperExist, getDevelopersById);
app.patch("/developers/:id", validateDataMiddleware, ensureDeveloperExist, patchDeveloper);
app.patch("/developers/:id/infos", validateDataDevInfoMiddleware, ensureDeveloperExist, patchDeveloperInfos);
app.delete("/developers/:id", ensureDeveloperExist, deleteDeveloper);

app.post("/projects", validateDataMiddlewareProjects, createProject);
app.get("/projects", listProjects);
app.get("/projects/:id", ensureDeveloperExist, listProjectsById);
app.patch("/projects/:id", validateDataMiddlewareProjects, ensureDeveloperExist, updateProject);
app.delete("/projects/:id", ensureDeveloperExist, deleteProject);

app.post("/projects/:id/technologies", ensureProjectExist, validateDataMiddlewareTechnology, createTechnologies);
app.delete("/projects/:id/technologies/:name", ensureProjectExist, validateDataMiddlewareTechnology, deleteTechnologies);

app.listen(3000, async () => {
  console.log("Server is Runing!");
  await startDatabase();
});
