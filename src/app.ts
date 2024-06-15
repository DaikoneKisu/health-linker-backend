import 'reflect-metadata'
import path from 'path'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { serve, setup } from 'swagger-ui-express'
import { NODE_ENV, PORT, ORIGIN, LOG_FORMAT, CREDENTIALS, PUBLIC_DIR, isProd } from '@/config/env'
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers'
import { type ClassConstructor } from './types/class-constructor.type'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { SchemaObject } from 'openapi3-ts'
// import { ErrorMiddleware } from '@middlewares/error.middleware';

export class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor(controllers: ClassConstructor<unknown>[]) {
    this.app = express()
    this.env = NODE_ENV
    this.port = PORT

    this.initializePreviousMiddlewares()

    this.app = useExpressServer(this.app, {
      validation: true,
      classTransformer: true,
      controllers
    })
    this.initializeStaticFiles()
    this.initializeSwagger()

    this.initializeAfterMiddlewares()
    // this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`=================================`)
      console.info(`${isProd ? '=' : ''}======= ENV: ${this.env} ========`)
      console.info(`= 🚀 App listening on port ${this.port} =`)
      console.info(`=================================`)
    })
  }

  private initializePreviousMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream: process.stdout }))
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }))
    this.app.use(cookieParser())
    this.app.use(express.json())
    this.app.use(helmet())
  }

  private initializeAfterMiddlewares() {
    this.app.use(compression())
  }

  private initializeStaticFiles() {
    this.app.use('/public', express.static(path.join(__dirname, '../', PUBLIC_DIR)))
  }

  private initializeSwagger() {
    const storage = getMetadataArgsStorage()
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/dtos'
    }) as { [schema: string]: SchemaObject }
    const spec = routingControllersToSpec(storage, undefined, {
      components: { schemas: schemas },
      info: {
        title: 'Health Linker Backend',
        version: '1.0.0',
        description: 'Back end of the Health Linker telementoring application 🩺.'
      }
    })

    this.app.use('/docs', serve, setup(spec))
  }

  // private initializeErrorHandling() {
  //   this.app.use(ErrorMiddleware);
  // }
}
