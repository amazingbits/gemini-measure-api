import "./libs/module-alias";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "node:http";
import { routes } from "./routes";

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
  }

  public init(): void {
    this.setupMiddlewares();
    this.setupRoutes();
  }

  public startServer(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
