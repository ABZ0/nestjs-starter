import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as rateLimiter from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from './config/config.service';
import { RequestIdMiddleware } from './core/middleware';
import cookieSession = require('cookie-session');

export function configure(app: INestApplication, config: ConfigService): void {
  app.use(
    helmet(),
    compression(),
    cookieParser(),
    cookieSession({ signed: false }), // TODO understand keys purpose
    rateLimiter({
      windowMs: 10 * 60 * 1000, // 1 Hour
      max: config.rateLimit,
      message: 'Too many requests, please try again later.',
    }),
    RequestIdMiddleware,
    (req, res, next) => {
      // https://github.com/goldbergyoni/nodebestpractices/blob/49da9e5e41bd4617856a6ecd847da5b9c299852e/sections/production/assigntransactionid.md
      req.session.id = req?.session?.id ? req.session.id : uuidv4();
      next();
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: false,
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
}
