import 'reflect-metadata'
import path from 'path'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { serve, setup } from 'swagger-ui-express'
import {
  NODE_ENV,
  PORT,
  ORIGIN,
  LOG_FORMAT,
  CREDENTIALS,
  PUBLIC_DIR,
  PUBLIC_PATH,
  isProd
} from '@/config/env'
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers'
import { type ClassConstructor } from './types/class-constructor.type'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { SchemaObject } from 'openapi3-ts'
import { AuthenticationMiddleware } from './middlewares/authentication.middleware'
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker'
import { CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker'
import { getMetadataStorage } from 'class-validator'
// import { ErrorMiddleware } from '@middlewares/error.middleware';
import { Server as SocketServer } from 'socket.io'
import { createServer, Server as NodeServer } from 'node:http'

export class App {
  public app: express.Application
  public env: string
  public port: string | number
  public server: NodeServer
  public io: SocketServer

  constructor(
    controllers: ClassConstructor<unknown>[],
    authorizationChecker: AuthorizationChecker,
    currentUserChecker: CurrentUserChecker
  ) {
    this.app = express()
    this.env = NODE_ENV
    this.port = PORT

    // For the chat server
    this.server = createServer(this.app)
    this.io = new SocketServer(this.server, {
      serveClient: false
    })

    this.initializePreviousMiddlewares()

    this.app = useExpressServer(this.app, {
      validation: true,
      classTransformer: true,
      controllers,
      authorizationChecker,
      currentUserChecker,
      middlewares: [AuthenticationMiddleware]
    })
    this.initializeStaticFiles()
    this.initializeWebSocket()
    this.initializeSwagger()

    this.initializeAfterMiddlewares()
    // this.initializeErrorHandling();
  }

  public listen() {
    this.server.listen(this.port, () => {
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
    this.app.use(`/${PUBLIC_PATH}`, (_, res, next) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin')
      next()
    })
    this.app.use(`/${PUBLIC_PATH}`, express.static(path.join(__dirname, '../', PUBLIC_DIR)))
  }

  private initializeSwagger() {
    const storage = getMetadataArgsStorage()
    const schemas = validationMetadatasToSchemas({
      classValidatorMetadataStorage: getMetadataStorage(),
      additionalConverters: {
        DateBeforeNow: (meta) => {
          //! This does not work, should change this dependency for another 'cuz this one is near to deprecation
          return { description: meta.name, type: 'string' }
        }
      },
      refPointerPrefix: '#/dtos'
    }) as { [schema: string]: SchemaObject }
    const spec = routingControllersToSpec(storage, undefined, {
      components: {
        schemas: schemas,
        securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
      },
      security: [{ bearerAuth: [] }],
      info: {
        title: 'Health Linker Backend',
        version: '1.0.0',
        description: 'Back end of the Health Linker telementoring application 🩺.'
      }
    })

    this.app.use('/docs', serve, setup(spec))
  }

  /**
   * Adds event listeners to websocket server for chats
   */
  private initializeWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('Hola mundo')

      socket.on('disconnect', () => {
        console.log('Adios mundo')
      })
    })
  }

  // private initializeErrorHandling() {
  //   this.app.use(ErrorMiddleware);
  // }
}
