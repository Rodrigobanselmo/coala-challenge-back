import { IsEmail, IsString } from 'class-validator';

export class LoginGoogleUserDto {
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly googleToken?: string;
}
