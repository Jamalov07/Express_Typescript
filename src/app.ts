import express from "express";
import { connect } from "mongoose";
import { dbConnection } from "./database";
import cors from "cors";
import { Routes } from "./interfaces/routes.interface";
import errorMiddleware from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yamljs";

class App {
  public app: express.Application;
  public port: number = 3000;
  constructor(routes: Routes[]) {
    this.app = express();

    this.connectionToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initialSwagger();
  }

  public listen() {
    this.app.listen(this.port);
    console.log(`Server is running at ${this.port}!`);
  }

  private async connectionToDatabase() {
    try {
      await connect(dbConnection.url, dbConnection.options);
      console.log("Connected to database!");
    } catch (error) {
      console.log(error);
    }
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initialSwagger() {
    const file = fs.readFileSync(__dirname + "/../swagger.yaml", "utf8");
    const swaggerDocument = YAML.parse(file);
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    console.log("Swagger connected!");
  }
}

export default App;
