import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import {
  EmailTakenException,
  InvalidCredentialsException,
} from 'src/core/exceptions';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { LoginVm, UserVm } from 'src/user/view-models';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponse()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    const { password, ...data } = dto;

    // 1. Check email uniqueness
    const exist = await this.userService.exists({ email: dto.email });
    if (exist) throw new EmailTakenException();

    // 2. Encrypt user password
    const hash = await this.authService.generateHashedPassword(password);

    // 3. Create user
    const user = await this.userService.create({ hash, ...data });

    // 4. Generate email verification token
    const token = this.authService.createToken(user);

    // 5. Send verification email

    return new UserVm(user);
  }

  @Post('login')
  async loginUser(@Body() dto: LoginDto) {
    const { email, password } = dto;

    // 1. Check email
    const user = await this.userService.findOne({ email });
    if (!user) throw new InvalidCredentialsException();

    // 2. Check password
    const isValid = await this.authService.comparePassword(password, user.hash);
    if (!isValid) throw new InvalidCredentialsException();

    // 3. Generate jwt token
    const token = this.authService.createToken(user);

    return new LoginVm({ user, token });
  }
}
