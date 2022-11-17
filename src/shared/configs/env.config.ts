import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

@Injectable()
export class EnvConfig {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync('.env')) as unknown as {
      [key: string]: string;
    };
  }

  private int(value: string | undefined, number: number): number {
    return value
      ? Number.isNaN(Number.parseInt(value))
        ? number
        : Number.parseInt(value)
      : number;
  }

  protected bool(value: string | undefined, defaultValue: boolean): boolean {
    return value ? true : defaultValue;
  }

  get env(): string {
    return process.env.NODE_ENV || this.envConfig.NODE_ENV || 'local';
  }

  private cors(value: string | undefined): string[] | 'all' {
    if (value === 'all' || value === undefined) {
      return 'all';
    }

    return value
      ? value.split(',').map((name) => name.trim())
      : ['http://localhost:3000'];
  }
  fakeDatabaseUrl(): string[] {
    return this.envConfig['FAKE_DATABASE_URL']
      ? this.envConfig['FAKE_DATABASE_URL'].split(',')
      : [
          'https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json',
          'https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json',
        ];
  }
  fakeBaseUrl(): string {
    return (
      this.envConfig['FAKE_DATABASE_URL'] || 'https://storage.googleapis.com'
    );
  }

  get apiVersion(): string {
    return this.envConfig['API_VERSION'] || 'api/v1';
  }

  get corsAllowedOrigins(): string[] | string {
    return this.cors(this.envConfig['CORS_ALLOWED_ORIGINS'] || 'all');
  }

  get corsEnabled(): boolean {
    return this.bool(this.envConfig['CORS_ENABLED'], true);
  }

  get host(): string {
    return this.envConfig['HOST'] || '127.0.0.1';
  }

  get port(): number {
    return this.int(this.envConfig['PORT'], 3111);
  }

  get timeoutResponse(): number {
    return this.int(this.envConfig['TIMEOUT_RESPONSE'], 90000);
  }
}
