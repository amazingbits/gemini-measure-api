import "dotenv/config";
import { SetupApplication } from "./app";

class Server {
  static start(): void {
    const application = new SetupApplication(
      Number(process.env.APPLICATION_PORT)
    );
    application.init();
    application.startServer();
  }
}

Server.start();
