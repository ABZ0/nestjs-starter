import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from 'src/config/config.service';
import { ObjectId } from 'src/core/utils';
import { User } from 'src/user/models';
import { JWTPayload } from './classes';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  createToken(user: User): string {
    const { _id, emailVerified } = user;
    const id = (_id as ObjectId).toHexString();
    const payload: JWTPayload = { id, emailVerified };
    const secret = this.configService.jwtSecret;
    const expiresIn = this.configService.jwtExpire;
    return sign(payload, secret, { expiresIn });
  }

  validateToken(token: string) {
    const secret = this.configService.jwtSecret;
    try {
      return verify(token, secret) as JWTPayload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  generateHashedPassword = async (password: string) => {
    return await bcryptjs.hash(password, await bcryptjs.genSalt(12));
  };

  comparePassword = async (password: string, hash: string) => {
    return await bcryptjs.compare(password, hash);
  };
}
