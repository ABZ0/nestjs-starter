import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from 'src/core/decorators';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
