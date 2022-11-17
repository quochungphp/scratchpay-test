/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { bootstrapRouteLog } from './utils/bootstrap-route-log';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { useContainer } from 'class-validator';
import { EnvConfig } from './shared/configs/env.config';
import { bootstrapApp } from './utils/bootstrap-app';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const envConfig = new EnvConfig();
  const { port, host } = envConfig;

  bootstrapApp(app, envConfig);
  app.useGlobalFilters(new HttpExceptionFilter(envConfig));
  const logMessage = `api server started host: ${host}:${port} `;
  await app
    .listen(port, () => {
      logger.log({ port }, logMessage);
      bootstrapRouteLog(app);
    })
    .catch((error) => {
      logger.error(
        {
          err: error,
          errorStack: error.stack,
        },
        'fail to start server',
      );
      process.exit(1);
    });
}
bootstrap();
