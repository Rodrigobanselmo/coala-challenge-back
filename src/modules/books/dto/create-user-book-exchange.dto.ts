import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserBookExchangeDto {
  @IsString()
  interetUserId: string;

  @IsInt()
  interestBookId: number;

  @IsString()
  targetUserId: string;

  @IsInt()
  @IsOptional()
  askingBookId?: number;
}
