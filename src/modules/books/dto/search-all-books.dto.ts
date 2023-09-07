import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class SearchAllBooksDto extends PaginationQueryDto {
  @IsString()
  @IsNotEmpty()
  search: string;
}
