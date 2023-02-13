import { Client } from "pg";
import "dotenv/config";

const client: Client = new Client({
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  database: process.env.DB,
  port: Number(process.env.DBPORT),
});

export { client };
