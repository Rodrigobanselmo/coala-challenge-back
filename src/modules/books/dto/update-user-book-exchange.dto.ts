import { StatusEnum } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserBookExchangeDto {
  @IsOptional()
  @IsString()
  interetUserId?: string;

  @IsInt()
  @IsOptional()
  interestBookId?: number;

  @IsOptional()
  @IsString()
  targetUserId?: string;

  @IsInt()
  @IsOptional()
  askingBookId?: number;

  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of status: ${StatusEnum.DONE}, ${StatusEnum.CANCELED}, ${StatusEnum.PENDING}`,
  })
  status?: StatusEnum;
}
