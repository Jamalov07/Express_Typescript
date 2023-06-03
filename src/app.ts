import express from "express";
import { connect } from "mongoose";
import { dbConnection } from "./database";
import cors from "cors";
import { Routes } from "./interfaces/routes.interface";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public app: express.Application;
  public port: number = 3000;
  constructor(routes: Routes[]) {
    this.app = express();

    this.connectionToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
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
}

export default App;
