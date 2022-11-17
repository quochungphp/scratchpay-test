import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { ClinicController } from './clinic.controller';
import { ClinicSearchHandler } from './handlers/clinic-search.handler';
import { ClinicRepository } from './repositories/clinic.repository';

@Module({
  imports: [SharedModule],
  providers: [ClinicRepository, ClinicSearchHandler],
  controllers: [ClinicController],
})
export class ClinicModule {}
