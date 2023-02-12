import express, { Application } from "express";
import { startDatabase } from "./database/database";
import {
  createDeveloper,
  createDeveloperInfos,
  getDevelopersById,
  getAllDevelopers,
  patchDeveloper,
  patchDeveloperInfos,
  deleteDeveloper
} from "./logics/developers.logics";
import { ensureDeveloperExist } from "./middleware/developer.middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", createDeveloper);
app.post("/developers/:id/infos", ensureDeveloperExist, createDeveloperInfos);
app.get("/developers", getAllDevelopers);
app.get("/developers/:id/infos", ensureDeveloperExist, getDevelopersById);
app.patch("/developers/:id", ensureDeveloperExist, patchDeveloper);
app.patch("/developers/:id/infos", ensureDeveloperExist, patchDeveloperInfos);
app.delete("/developers/:id", ensureDeveloperExist, deleteDeveloper);

app.listen(3000, async () => {
  console.log("Server is Runing!");
  await startDatabase();
});
