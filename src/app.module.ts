import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ConfigModuleConfig } from './config/options';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRootAsync(ConfigModule, {
      useClass: ConfigModuleConfig,
    }),
    CoreModule,
  ],
})
export class AppModule {}
