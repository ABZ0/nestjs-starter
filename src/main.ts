import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure } from './config.main';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication');
  const config = app.get(ConfigService);
  const port = config.port;
  configure(app, config);
  await app.listen(port);
  logger.verbose(`http://localhost:${port}/swagger`);
}
bootstrap();
