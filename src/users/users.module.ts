import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailToken, EmailTokenSchema } from './entities/email-token.entity';
import { MailService } from './mail.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailToken.name, schema: EmailTokenSchema },
    ]),
    ConfigModule.Deferred,
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
