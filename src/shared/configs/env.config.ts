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
    return [
      'https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json',
      'https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json',
    ];
  }

  get apiVersion(): string {
    return this.envConfig['apiVersion'] || 'api/v1';
  }

  get corsAllowedOrigins(): string[] | string {
    return this.cors(this.envConfig['corsAllowedOrigins'] || 'all');
  }

  get corsEnabled(): boolean {
    return this.bool(this.envConfig['corsEnabled'], true);
  }

  get host(): string {
    return this.envConfig['host'] || '127.0.0.1';
  }

  get port(): number {
    return this.int(this.envConfig['port'], 3111);
  }
}
