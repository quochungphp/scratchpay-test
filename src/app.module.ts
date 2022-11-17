import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClinicModule } from './modules/clinic/clinic.module';
import { SharedModule } from './shared/shared.module';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';

@Module({
  imports: [ClinicModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
