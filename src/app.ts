import express, { Application } from "express";
import { startDatabase } from "./database/database";
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
import { ensureDeveloperExist } from "./middleware/developer.middleware";
import { ensureProjectExist } from "./middleware/projects.middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", createDeveloper);
app.post("/developers/:id/infos", ensureDeveloperExist, createDeveloperInfos);
app.get("/developers", getAllDevelopers);
app.get("/developers/:id/infos", ensureDeveloperExist, getDevelopersById);
app.patch("/developers/:id", ensureDeveloperExist, patchDeveloper);
app.patch("/developers/:id/infos", ensureDeveloperExist, patchDeveloperInfos);
app.delete("/developers/:id", ensureDeveloperExist, deleteDeveloper);

app.post("/projects", createProject);
app.get("/projects", listProjects);
app.get("/projects/:id", ensureProjectExist, listProjectsById);
app.patch("/projects/:id", ensureProjectExist, updateProject);
app.delete("/projects/:id", ensureProjectExist, deleteProject);

app.post("/projects/:id/technologies", ensureProjectExist, createTechnologies);
app.delete("/projects/:id/technologies/:name", ensureProjectExist, deleteTechnologies);

app.listen(3000, async () => {
  console.log("Server is Runing!");
  await startDatabase();
});
