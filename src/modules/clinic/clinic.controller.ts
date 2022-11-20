import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppRequest } from '../../utils/app-request';
import { AuthVerifyApiKey } from '../../utils/auth/auth-verify-api-key.guard';
import { ClinicSearchHandler } from './handlers/clinic-search.handler';
import { ClinicSearchQuery } from './types/clinic-search.query';

@Controller('clinics')
@ApiTags('Clinics')
@ApiSecurity('x-api-key', ['x-api-key'])
@UseGuards(AuthVerifyApiKey)
export class ClinicController {
  @Inject() private readonly clinicSearchHandler: ClinicSearchHandler;
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getClinics(
    @Req() request: AppRequest,
    @Query() query: ClinicSearchQuery,
  ) {
    return this.clinicSearchHandler.execute(request, query);
  }
}
