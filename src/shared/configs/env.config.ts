import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

@Injectable()
export class EnvConfig {
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
    return process.env.NODE_ENV || 'local';
  }

  private cors(value: string | undefined): string[] | 'all' {
    if (value === 'all' || value === undefined) {
      return 'all';
    }

    return value
      ? value.split(',').map((name) => name.trim())
      : ['http://localhost:3000 '];
  }
  fakeDatabaseUrl(): string[] {
    return process.env.FAKE_DATABASE_URL
      ? process.env.FAKE_DATABASE_URL.split(',')
      : [
          'https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json',
          'https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json',
        ];
  }
  fakeBaseUrl(): string {
    return process.env.FAKE_DATABASE_URL || 'https://storage.googleapis.com';
  }

  get apiVersion(): string {
    return process.env.API_VERSION || 'api/v1';
  }

  get corsAllowedOrigins(): string[] | string {
    return this.cors(process.env.CORS_ALLOWED_ORIGINS || 'all');
  }

  get corsEnabled(): boolean {
    return this.bool(process.env.CORS_ENABLED, true);
  }

  get host(): string {
    return process.env.HOST || '127.0.0.1';
  }

  get port(): number {
    return this.int(process.env.PORT, 3111);
  }

  get timeoutResponse(): number {
    return this.int(process.env.TIMEOUT_RESPONSE, 90000);
  }

  get xApiKey(): string {
    return process.env.X_API_KEY || 'X_API_KEY';
  }

  get redisHost(): string {
    if (process.env.IS_LOCAL_MACHINE === 'true') {
      // start on separate process
      return 'localhost';
    }
    return process.env.REDIS_HOST || '127.0.0.1';
  }

  get redisPort(): number {
    return this.int(process.env.REDIS_PORT, 6379);
  }

  get redisPassword(): string {
    return process.env.REDIS_PASSWORD || '123456';
  }
}
