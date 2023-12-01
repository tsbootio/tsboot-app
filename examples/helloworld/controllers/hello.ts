import { route, controller } from '../../../'

@controller()
export class HelloWorld {
  @route('GET', '/')
  hello() {
    return new Response('Hello, World!')
  }
}
