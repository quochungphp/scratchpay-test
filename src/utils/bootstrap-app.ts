import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { EnvConfig } from '../shared/configs/env.config';
import { ErrorResponseTransformInterceptor } from './interceptors/error-response-transform.interceptor';
import { SuccessResponseTransformInterceptor } from './interceptors/success-response-transform.interceptor';

export async function bootstrapApp(
  app: NestExpressApplication,
  envConfig: EnvConfig,
) {
  const { apiVersion } = envConfig;
  app.setGlobalPrefix(apiVersion, {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  const config = new DocumentBuilder()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API key for external calls',
      },
      'x-api-key',
    )
    .setTitle('Backend Services')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiVersion}/api-docs`, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(helmet());
  const { corsEnabled, corsAllowedOrigins } = envConfig;
  const cors = corsEnabled
    ? {
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
          'Authorization',
          'RefreshToken',
          'Content-Type',
          'Accept',
          'Origin',
          'Referer',
          'User-Agent',
          'Authorization',
          'X-Signature',
          'X-Api-Key',
          'X-Request-Id',
        ],
        exposedHeaders: [
          'Authorization',
          'RefreshToken',
          'X-Api-Key',
          'AccessToken',
          'X-Signature',
        ],
        origin(
          origin: string,
          callback: (error: Error | null, success?: true) => void,
        ) {
          if (corsAllowedOrigins === 'all') {
            callback(null, true);
            return;
          }
          if (corsAllowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`Origin[${origin}] not allowed by CORS`));
          }
        },
      }
    : {};
  app.enableCors(cors);
  app.useGlobalInterceptors(
    new SuccessResponseTransformInterceptor(),
    new ErrorResponseTransformInterceptor(),
  );
}
