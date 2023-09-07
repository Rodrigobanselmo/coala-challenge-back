import { IsString } from 'class-validator';

export class LoginGoogleUserDto {
  @IsString()
  readonly token: string;
}
