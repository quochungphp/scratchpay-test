import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EnvConfig } from '../../shared/configs/env.config';
@Injectable()
export class AuthVerifyApiKey implements CanActivate {
  @Inject()
  private readonly envConfig: EnvConfig;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request] = context.getArgs();
    const xApiKeyHeader = request.headers['x-api-key'];
    if (!xApiKeyHeader) {
      throw new UnauthorizedException('The x-api-key not found');
    }

    const { xApiKey } = this.envConfig;

    if (xApiKeyHeader !== xApiKey) {
      throw new UnauthorizedException('The x-api-key is not correct');
    }

    return true;
  }
}
