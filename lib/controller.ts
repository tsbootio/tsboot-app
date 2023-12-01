import "reflect-metadata";

import {
  RouterMetadata,
  ROUTER_METADATA_KEY,
  RequestHandlerParam
} from "./router";
import { HttpRouter } from "./server";

const CONTROLLERS = new Map<string, Object>();

(global as any)['tsboot'] = {
  controllers: []
}

export function controller() {
  return function (constructor: Function) {
    (global as any)['tsboot']['controllers'].push(constructor)
  };
}

export function discoverRouters(folderPath: string): HttpRouter[] {
  let routerMetadata = new Map<string, RouterMetadata>();

  const controllers = (global as any)['tsboot']['controllers']
  for (const controller of controllers) {
    const metadata = Reflect.getMetadata(ROUTER_METADATA_KEY, controller);
    if (metadata) {
      routerMetadata = new Map([...routerMetadata, ...metadata])
    }
  }

  const httpRouters: HttpRouter[] = [];
  routerMetadata.forEach((metadata) => {
    httpRouters.push(createRouter(metadata));
  });

  return httpRouters;
}

export function createRouter(metadata: RouterMetadata): HttpRouter {
  return {
    id: `${metadata.controllerClass.name}:${metadata.controllerFunctionName}`,
    method: metadata.httpMethod,
    pathPattern: metadata.pathPattern,
    handler: async (param: RequestHandlerParam) => {
      let controller = CONTROLLERS.get(metadata.controllerClass.name)
      if (!controller) {
        controller = new metadata.controllerClass()
        CONTROLLERS.set(metadata.controllerClass.name, controller!);
      }
      return metadata.controllerFunction.apply(controller, [param]);
    },
  };
}
