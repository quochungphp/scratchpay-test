import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppRequest } from '../../utils/app-request';
import { ClinicSearchHandler } from './handlers/clinic-search.handler';
import { ClinicSearchQuery } from './types/clinic-search.query';

@Controller('clinics')
@ApiTags('Clinics')
export class ClinicController {
  @Inject() private readonly clinicSearchHandler: ClinicSearchHandler;
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getUserByStarkKey(
    @Req() request: AppRequest,
    @Query() query: ClinicSearchQuery,
  ) {
    return this.clinicSearchHandler.execute(request, query);
  }
}
