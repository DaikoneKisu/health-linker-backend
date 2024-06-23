import {
  BadRequestError,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  UploadedFile
} from 'routing-controllers'
import { CreateClinicalCaseFileDto } from '@/dtos/clinical-case-file.dto'
import { ClinicalCaseFileRepository } from '@/repositories/clinical-case-file.repository'
import { ClinicalCaseFileService } from '@/services/clinical-case-file.service'
import { acceptedFileFormats, fileUploadOptions } from '@/config/multer'
import { File } from '@/types/file.type'

@JsonController('/clinical-cases-files')
export class ClinicalCaseFileController {
  private readonly _clinicalCaseFileService: ClinicalCaseFileService = new ClinicalCaseFileService(
    new ClinicalCaseFileRepository()
  )

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._clinicalCaseFileService.getAll()
  }

  @HttpCode(200)
  @Get('/by-clinical-case/:id')
  public get(@Param('id') id: number) {
    return this._clinicalCaseFileService.getByClinicalCase(id)
  }

  @HttpCode(201)
  @Post()
  public create(
    @Body() createClinicalCaseFileDto: CreateClinicalCaseFileDto,
    @UploadedFile('file', { options: fileUploadOptions }) file: File | undefined
  ) {
    if (!file) {
      throw new BadRequestError(
        `No se envió un archivo o el formato del archivo no es aceptado. Los formatos de archivos aceptados son: ${acceptedFileFormats.join(', ')}`
      )
    }

    return this._clinicalCaseFileService.create(createClinicalCaseFileDto, file)
  }

  @HttpCode(200)
  @Delete('/:id')
  public delete(@Param('id') id: number) {
    return this._clinicalCaseFileService.delete(id)
  }
}
