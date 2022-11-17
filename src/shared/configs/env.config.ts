import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvConfig {
  public envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = process.env;
  }

  protected int(value: string | undefined, defaultValue: number): number {
    return Number.parseInt(value, 10) || defaultValue;
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
}
