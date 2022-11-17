import { Logger } from '@nestjs/common';

export interface RequestContext {
  user: any;
  correlationId: string;
  logger: Logger;
}
