import { Server } from "bun";
import { RequestHandlerParam, HttpParameters } from "./router";


export interface HttpRouter {
  id: string;
  method: string;
  pathPattern: string;
  handler: (param: RequestHandlerParam) => Promise<Response>;
}

export class HttpServer {
  constructor() {
  }

  private bunServer?: Server;
  private routers: HttpRouter[] = [];

  public route({ id, method, pathPattern, handler }: HttpRouter) {
    this.routers.push({
      id,
      method,
      pathPattern,
      handler,
    });
  }

  public start() {
    this.bunServer = Bun.serve({
      fetch: async (req) => {
        const response = await this.handleRequest(req);
        return response;
      },
    });
    console.log(`server active: http://${this.bunServer.hostname}:${this.bunServer.port}`)
  }

  public async stop() {
    console.log('stopping server')
    this.bunServer?.stop()
  }

  private async handleRequest(request: Request) {
    console.log(`${request.method} ${request.url}`)
    const url = new URL(request.url)
    const path = url.pathname;
    const queryParams = getQueryParams(url)
    const [router, pathParams] = this.findMatchingRouter(request.method, path);

    if (!router) {
      return new Response('Not Found', { status: 404 });
    }

    return await router.handler({ request, pathParams, queryParams });
  }

  private findMatchingRouter(method: string, path: string): [HttpRouter | undefined, HttpParameters] {
    let pathParams: HttpParameters = {};
    const router = this.routers.find((router) => {
      if (method != router.method) {
        return false;
      }

      const samePath = (
        path === router.pathPattern &&
        method.toUpperCase() === router.method
      );
      if (samePath) {
        return true;
      }

      const [match, params] = matchPathPattern(router.pathPattern, path)
      pathParams = params
      return match;
    });

    return [router, pathParams];
  }
}

function matchPathPattern(pathPattern: string, path: string): [boolean, HttpParameters] {
  const pathArray = path.split('/');
  const pathPatternArray = pathPattern.split('/');

  if (pathArray.length !== pathPatternArray.length) {
    return [false, {}];
  }

  const pathParams: HttpParameters = {};
  for (let i = 0; i < pathArray.length; i++) {
    // assume no ':xxx' in the path
    if (pathArray[i] === pathPatternArray[i]) {
      continue;
    }

    if (!pathPatternArray[i].startsWith(':')) {
      return [false, pathParams];
    }

    const paramKey = pathPatternArray[i].replace(':', '');
    pathParams[paramKey] = pathArray[i];
  }

  return [true, pathParams]
}

function getQueryParams(url: URL) {
  const params = new URLSearchParams(url.search);
  const queryParams: HttpParameters = {};

  for (const [key, value] of params) {
    queryParams[key] = value
  }

  return queryParams;
}
