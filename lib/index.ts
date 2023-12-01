import { App } from "./app";

function createApp() {
  return new App()
}

export { createApp as tsboot }
export { route } from './router'
export type { RequestHandlerParam } from './router'
export { controller } from './controller'
