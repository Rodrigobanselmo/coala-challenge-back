import { IsInt, IsString } from 'class-validator';

export class FindUserBookExchangeDto {
  @IsString()
  interetUserId: string;

  @IsInt()
  interestBookId: number;

  @IsString()
  targetUserId: string;
}
