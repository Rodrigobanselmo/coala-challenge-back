import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Max(1000)
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @Max(100000000)
  page?: number = 1;
}
