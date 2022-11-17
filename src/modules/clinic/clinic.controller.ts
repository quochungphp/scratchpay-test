import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppRequest } from '../../utils/app-request';
import { ClinicSearchHandler } from './handlers/clinic-search.handler';

@Controller('clinics')
@ApiTags('Clinics')
export class ClinicController {
  @Inject() private readonly clinicSearchHandler: ClinicSearchHandler;
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getUserByStarkKey(@Req() request: AppRequest) {
    return this.clinicSearchHandler.execute(request);
  }
}
