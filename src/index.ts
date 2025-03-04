import express from "express";
import "express-async-errors";
import { getDatetime } from "./helpers/dateTime";
import { saveToLogFile } from "./helpers/saveToLogFile";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { AppDataSource } from "./repositories/AppDataSource";
import routes from "./routes/routes";
import swaggerSetup from "./swagger";

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());
  swaggerSetup(app);
  app.use(routes);
  app.use(errorMiddleware);
  const dateTime = getDatetime();
  const initialize = `\r${dateTime} API-TEMPLATE now listening on : ${process.env.PORT}`;
  console.log(initialize);
  saveToLogFile(initialize);
  return app.listen(process.env.PORT);
});
