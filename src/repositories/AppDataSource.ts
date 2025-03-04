import "../env";
import "reflect-metadata";
import { DataSource } from "typeorm";

const port = Number(process.env.DB_PORT);
const host = String(process.env.DB_HOST);
const username = String(process.env.DB_USER);
const password = String(process.env.DB_PASS);
const database = String(process.env.DB_NAME);

export const AppDataSource = new DataSource({
  type: "mysql",
  host,
  port,
  username,
  password,
  database,
  entities: [`${__dirname}/../interfaces/Models/*.{ts,js}`],
});
