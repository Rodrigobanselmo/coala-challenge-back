import { IsEmail, IsInt, IsString } from 'class-validator';

export class UserPayloadDto {
  @IsInt()
  readonly id: string;

  @IsString()
  @IsEmail()
  readonly email: string;
}
