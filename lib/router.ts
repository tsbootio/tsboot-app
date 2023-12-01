import "reflect-metadata";

export const ROUTER_METADATA_KEY = 'routers';

export interface HttpParameters {
  [key: string]: string;
}

export interface RequestHandlerParam {
  request: Request;
  pathParams: HttpParameters;
  queryParams: HttpParameters;
}

export type ControllerClass = new () => any;

export interface RouterMetadata {
  httpMethod: string;
  pathPattern: string;
  controllerClass: ControllerClass;
  controllerFunctionName: string;
  controllerFunction: (param: RequestHandlerParam) => Response;
};

export function route(httpMethod: string, pathPattern: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const controllerClass = target.constructor;
    const routeMetadata = {
      httpMethod,
      pathPattern,
      controllerClass,
      controllerFunctionName: propertyKey,
      controllerFunction: descriptor.value,
    }

    addRouterMetadata(controllerClass, routeMetadata)
  };
}

function getRouterMetadata(controllerClass: ControllerClass): Map<string, RouterMetadata> {
  let routerMetadata = Reflect.getMetadata(ROUTER_METADATA_KEY, controllerClass);
  if (!routerMetadata) {
    routerMetadata = new Map<string, RouterMetadata>();
    Reflect.defineMetadata(ROUTER_METADATA_KEY, routerMetadata, controllerClass);
  }

  return routerMetadata;
}

function addRouterMetadata(controllerClass: ControllerClass, metadata: RouterMetadata) {
  const routerMetadata = getRouterMetadata(controllerClass)
  routerMetadata.set(metadata.pathPattern, metadata);
}
