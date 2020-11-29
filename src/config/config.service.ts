import { validatedPlainToClass, ValidationError } from '@marcj/marshal';
import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CONFIG_MODULE_OPTIONS } from './config.constants';
import { ConfigModuleOptions } from './interfaces/config-options.interface';
import { EnvConfig } from './model/env.model';

@Injectable()
export class ConfigService {
  private envConfig: EnvConfig;

  constructor(@Inject(CONFIG_MODULE_OPTIONS) options: ConfigModuleOptions) {
    if (!options.useProcess && !options.filename) {
      throw new Error(
        'Missing configuration options.' +
          ' If using process.env variables, please mark useProcess as "true".' +
          ' Otherwise, please provide an env file.',
      );
    }

    let config: { [key: string]: any };
    if (options.filename) {
      config = parse(readFileSync(join(process.env.PWD, options.filename)));
    } else {
      config = process.env;
    }

    this.envConfig = this.validateConfig(config);
  }

  private validateConfig(config: Record<string, any>): EnvConfig {
    try {
      return validatedPlainToClass(EnvConfig, config);
    } catch (err) {
      throw new Error(
        err.errors.map((err: ValidationError) => JSON.stringify(err)).join(' '),
      );
    }
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get isProd(): boolean {
    const env = this.nodeEnv.toLowerCase();
    return env === 'production' || env === 'prod';
  }

  get globalPrefix(): string {
    return this.envConfig.GLOBAL_PREFIX;
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  get rateLimit(): number {
    return this.envConfig.RATE_LIMIT;
  }

  get databaseUrl(): string {
    return this.envConfig.DATABASE_URL;
  }

  get appUrl(): string {
    return this.envConfig.APP_URL;
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get jwtExpire(): string {
    return this.envConfig.JWT_EXPIRE;
  }

  get emailFrom(): string {
    return this.envConfig.EMAIL_FROM;
  }

  get gmailPassword(): string {
    return this.envConfig.GMAIL_PASSWORD;
  }
}
