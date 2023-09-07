import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class FindUsersBooksDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}
