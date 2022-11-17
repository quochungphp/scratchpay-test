import { Logger } from '@nestjs/common';
import { Request } from 'express';

export interface AppRequest extends Request {
  user: any;
  correlationId: string;
  logger: Logger;
}
