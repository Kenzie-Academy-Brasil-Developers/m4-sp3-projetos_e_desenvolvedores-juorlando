import { Client } from "pg";

const client: Client = new Client({
  user: "junio",
  password: "16112019",
  host: "localhost",
  database: "developers_m4",
  port: 5432,
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  return console.log("Database conectada");
};

export { client, startDatabase };