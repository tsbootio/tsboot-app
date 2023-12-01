# tsboot-app
tsboot-app is intended for bring Java Spring boot and Python Flask like development
experience (the good part) into TypeScript/JavaScript eco-system by adopting the
new awesome all-in-one TypeScript/JavaScript development tool kit Bun.

If you are the developer who enjoys the simplicity and elegance of creating
RESTful API in Java and python decorators, you would probably love this.

## Prerequisites and tools
Install latest version of Bun: https://bun.sh/

## Getting Started
1. clone this repo, and go the its root folder;
2. run `bun install`;
3. `cd examples/helloworld/`;
4. run `bun index.ts`;
5. try `curl 'http://localhost:3000/'` or ` curl 'http://localhost:3000/hello/a/b'`;
6. check out file in the folder `examples/helloworld/controllers` to explore more.

With this library, creating a REST API server app is as simple as shown below:
```
import {
  route,
  controller,
  RequestHandlerParam,
  tsboot,
} from 'the-path-to-lib-root'

@controller()
export class ExampleController {
  @route('GET', '/hello/:patha/:pathb')
  hello1({ pathParams, queryParams }: RequestHandlerParam) {
    console.log('pathParams:', pathParams);
    console.log('queryParams:', queryParams);
    return new Response('hello');
  }
}

const app = tsboot();
app.run()
```

## Development plan
- [] Handle file stream
- [] Render html views and host frontend assets
