import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly googleExternalId: string;

  @IsString()
  @IsOptional()
  readonly photoUrl: string;

  @IsString()
  @IsOptional()
  readonly name: string;
}
