import { route, controller, RequestHandlerParam } from '../../../'

@controller()
export class ExampleController {
  private helloWorld = 'Hello, world!'

  @route('GET', '/hello')
  hello() {
    console.log(this.helloWorld);
    return new Response(this.helloWorld)
  }

  @route('GET', '/hello/:patha/:pathb')
  hello1({ pathParams, queryParams }: RequestHandlerParam) {
    console.log('pathParams:', pathParams);
    console.log('queryParams:', queryParams);
    return new Response(
      `${this.helloWorld}\n${JSON.stringify(pathParams)}\n${JSON.stringify(queryParams)}`
    );
  }
}
