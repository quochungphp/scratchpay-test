import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClinicModule } from './modules/clinic/clinic.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ClinicModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
