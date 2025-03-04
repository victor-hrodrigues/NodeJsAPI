import { Express } from "express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation API-TEMPLATE",
      version: "1.0.0",
      description: "API Documentation API-TEMPLATE",
    },
    basePath: "/",
  },
  apis: ["./controllers/*.ts"],
};

const specs = swaggerJSDoc(options);

export default (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
