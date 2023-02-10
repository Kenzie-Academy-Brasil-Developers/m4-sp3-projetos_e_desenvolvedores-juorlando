import express, { Application } from "express";
import { startDatabase } from "./database";
import { createDeveloper } from "./logics/developers.logics";

const app: Application = express();
app.use(express.json());

app.post("/developers", createDeveloper);

app.listen(3000, async () => {
  console.log("Server is Runing!");
  await startDatabase();
});
