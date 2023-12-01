import { tsboot } from '../../'

import './controllers/hello'
import './controllers/example'

const app = tsboot();
app.run()
