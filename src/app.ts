import "./libs/module-alias";
import "express-async-errors";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "node:http";
import { routes } from "./routes";
import { errorHandler } from "./http/middlewares/errors";
import NotFoundError from "./http/errors/not-found-error";

export class SetupApplication {
  private server?: Server;

  constructor(private port = 3333, public app = express()) {}

  private setupMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private setupRoutes() {
    this.app.use(routes);
    this.app.all("/*", (_request, _response) => {
      throw new NotFoundError({
        message: "route not found",
      });
    });
  }

  public init(): void {
    this.setupMiddlewares();
    this.setupRoutes();
    this.app.use(errorHandler);
  }

  public startServer(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
