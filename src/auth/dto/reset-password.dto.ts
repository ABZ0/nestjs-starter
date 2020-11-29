import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword } from 'src/core/decorators';

export class ResetPasswordDto {
  @IsString()
  @MinLength(50)
  @MaxLength(75)
  code: string;

  @IsStrongPassword()
  newPassword: string;
}
