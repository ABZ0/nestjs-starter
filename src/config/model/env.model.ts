import { f } from '@marcj/marshal';

export class EnvConfig {
  @f
  NODE_ENV: 'production' | 'prod' | 'development' | 'dev' = 'development';

  @f
  PORT: number = 4000;

  @f
  GLOBAL_PREFIX: string = 'api';

  @f
  RATE_LIMIT: number = 1000;

  @f
  API_URL: string = 'http://localhost:4000';

  @f
  APP_URL: string;

  @f
  DATABASE_URL: string;

  @f
  JWT_SECRET: string;

  @f
  JWT_EXPIRE: string;

  @f
  EMAIL_FROM: string;

  @f
  GMAIL_PASSWORD: string;
}
