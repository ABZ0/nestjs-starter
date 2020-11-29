import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SigninDto,
  SignUpDto,
} from './dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LocalAuthGuard } from './guards';
import { IUserRequest } from './interfaces/user-request.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUpWithPassword(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  public signIn(@Request() req: IUserRequest, @Body() dto: SigninDto): any {
    this.addJwtToCookie(req);
    return { token: req.session.jwt, user: req.user };
    // redirect on frontend
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSExternalRedirectNotAllowed
  }

  @Get('/logout')
  public logOut(@Request() req: IUserRequest): void {
    req.session = null;
    return;
  }

  @Post('/verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<boolean> {
    return this.authService.verifyEmail(verifyEmailDto.code);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<boolean> {
    return this.authService.resetPassword(dto);
  }

  private addJwtToCookie(req: IUserRequest) {
    try {
      req.session.jwt = this.authService.generateJwtToken(req.user).accessToken;
    } catch (err) {
      throw new InternalServerErrorException(
        err,
        'Problem with cookie-session middleware?',
      );
    }
  }
}
