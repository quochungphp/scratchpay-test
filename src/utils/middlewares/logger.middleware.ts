/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as httpContext from 'express-http-context';
import { v4 as uuidv4 } from 'uuid';
import onHeaders = require('on-headers');
import { EnvConfig } from '../../shared/configs/env.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    httpContext.middleware(request, response, () => {
      const startTime = process.hrtime();
      const envConfig = new EnvConfig();
      const correlationId = (
        request.headers['request-id'] ||
        request.headers['x-request-id'] ||
        request.headers['x-correlation-id'] ||
        request.headers.correlationId ||
        uuidv4()
      ).toString();
      const logger = new Logger(LoggerMiddleware.name);
      const { method, baseUrl, body } = request;
      const url = (baseUrl || '') + (request.url || '-');
      const route = `${method} ${request.route ? request.route.path : url}`;

      onHeaders(response, function onHeaders() {
        const diff = process.hrtime(startTime);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
        response.setHeader('keep-alive', envConfig.timeoutResponse);
        response.setHeader('X-Response-Time', responseTime);
        logger.log(
          {
            responseTime,
            reqBody: body,
            statusCode: response.statusCode,
            route,
          },
          'Response',
        );
      });

      request.logger = logger;
      request.correlationId = correlationId;
      response.setHeader('x-correlation-id', correlationId);
      next();
    });
  }
}
