import { App } from '@/app'
import { CommonController } from './controllers/common.controller'

const app = new App([CommonController])

app.listen()
