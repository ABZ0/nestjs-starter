import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as rateLimiter from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from './config/config.service';
import { RequestIdMiddleware } from './core/middleware';

export function configure(
  app: INestApplication,
  config: ConfigService,
  logger: Logger,
): void {
  app.use(
    helmet(),
    compression(),
    rateLimiter({
      windowMs: 10 * 60 * 1000,
      max: config.rateLimit,
      message: 'Too many requests, please try again later.',
    }),
    RequestIdMiddleware,
  );
  app.getHttpAdapter().use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.enableCors({ credentials: true });
  app.setGlobalPrefix(config.globalPrefix);

  const options = new DocumentBuilder()
    .setTitle('nest-api')
    .setDescription('Swagger UI')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  logger.log('Application configuration complete');
}
