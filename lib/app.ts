import { HttpServer, HttpRouter } from "./server.ts";
import { discoverRouters } from './controller.ts'

export class App {
  private routers: HttpRouter[] = [];
  private server = new HttpServer();

  public run() {
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());

    this.routers = discoverRouters(process.cwd());
    this.routers.forEach((router) => {
      this.server.route(router);
      console.log(`[${router.method}, ${router.pathPattern}] ${router.id}`);
    });

    this.server.start();
  }

  private shutdown() {
    this.server.stop();
    process.exit();
  }
}
