import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams
} from 'routing-controllers'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { CreateSpecialtyDto, UpdateSpecialtyDto } from '@/dtos/specialty.dto'

@JsonController('/specialties')
export class SpecialtyController {
  private readonly _specialtyRepository: SpecialtyRepository = new SpecialtyRepository()

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._specialtyRepository.findWithLimitAndOffset(
      (paginationQuery.page || 1) - 1,
      paginationQuery.size || 10
    )
  }

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._specialtyRepository.findAll()
  }

  @HttpCode(200)
  @Get('/by-id/:id')
  public getOne(@Param('id') id: number) {
    return this._specialtyRepository.find(id)
  }

  @HttpCode(200)
  @Get('/by-name/:name')
  public getByName(@Param('name') name: string) {
    return this._specialtyRepository.findByName(name)
  }

  @HttpCode(200)
  @Post()
  public create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this._specialtyRepository.create(createSpecialtyDto)
  }

  @HttpCode(200)
  @Patch('/:id')
  public update(@Body() updateSpecialtyDto: UpdateSpecialtyDto, @Param('id') id: number) {
    return this._specialtyRepository.update(id, updateSpecialtyDto)
  }

  @HttpCode(200)
  @Delete('/:id')
  public delete(@Param('id') id: number) {
    return this._specialtyRepository.delete(id)
  }
}
