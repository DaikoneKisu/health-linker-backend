import { Get, HttpCode, JsonController, Post, UploadedFile } from 'routing-controllers'
import { fileUploadOptions } from '@/config/multer'
import { File } from '@/types/file.type'

@JsonController()
export class CommonController {
  @HttpCode(200)
  @Get()
  ok() {
    return {
      message: 'Ok'
    }
  }

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

  @HttpCode(200)
  @Post('/file-upload')
  fileUpload(@UploadedFile('file', { options: fileUploadOptions }) file: File) {
    return {
      ...file
    }
  }
}
