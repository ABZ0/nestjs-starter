import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  ForgotPasswordDto,
  SigninDto,
  ResetPasswordDto,
  SignUpDto,
} from './dto';
import { InvalidCredentialsException } from 'src/core/exceptions';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUpWithPassword(signUpDto: SignUpDto): Promise<User> {
    return await this.usersService.createWithPassword(signUpDto);
  }

  async verifyEmail(code: string): Promise<boolean> {
    await this.usersService.verifyEmail(code);
    return true;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return await this.usersService.sendResetPasswordEmail(forgotPasswordDto);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

  async validateUserPassword(signinDto: SigninDto): Promise<any> {
    const user = await this.usersService.findOne({ email: signinDto.email });
    if (!user || !(await bcrypt.compare(signinDto.password, user.password))) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  public generateJwtToken(user: User): { accessToken: string } {
    const payload: JwtPayload = { sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
