import 'reflect-metadata'
import path from 'path'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { NODE_ENV, PORT, ORIGIN, LOG_FORMAT, CREDENTIALS, PUBLIC_DIR } from '@/config/env'
import { useExpressServer } from 'routing-controllers'
import { type ClassConstructor } from './types/class-constructor.type'
// import { ErrorMiddleware } from '@middlewares/error.middleware';

export class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor(controllers: ClassConstructor<unknown>[]) {
    this.app = express()
    this.env = NODE_ENV || 'development'
    this.port = PORT || 3000

    this.app = useExpressServer(this.app, { validation: true, classTransformer: true, controllers })
    this.initializeMiddlewares()
    this.initializeStaticFiles()
    // this.initializeSwagger();
    // this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`=================================`)
      console.info(`${this.env === 'production' ? '=' : ''}======= ENV: ${this.env} ========`)
      console.info(`= 🚀 App listening on port ${this.port} =`)
      console.info(`=================================`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream: process.stdout }))
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }))
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(cookieParser())
  }

  private initializeStaticFiles() {
    this.app.use('/public', express.static(path.join(__dirname, '../', PUBLIC_DIR)))
  }

  // private initializeSwagger() {
  //   const options = {
  //     swaggerDefinition: {
  //       info: {
  //         title: "REST API",
  //         version: "1.0.0",
  //         description: "Example docs",
  //       },
  //     },
  //     apis: ["swagger.yaml"],
  //   };

  //   const specs = swaggerJSDoc(options);
  //   this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  // }

  // private initializeErrorHandling() {
  //   this.app.use(ErrorMiddleware);
  // }
}
