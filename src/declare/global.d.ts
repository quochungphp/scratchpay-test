import { Logger } from '@nestjs/common';
declare global {
  namespace Express {
    interface Request {
      logger: Logger;
      correlationId: string;
    }
  }
}
