import { Get, HttpCode, JsonController } from 'routing-controllers'

@JsonController()
export class CommonController {
  @HttpCode(200)
  @Get('/healthcheck')
  healthcheck() {
    return {
      message: 'Ok',
      uptime: `${process.uptime()} seconds`,
      responseTime: `${process.hrtime.bigint()} nanoseconds`,
      timestamp: new Date(Date.now())
    }
  }
}
