import { IsString, MinLength, MaxLength } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @MinLength(50)
  @MaxLength(75)
  code: string;
}
