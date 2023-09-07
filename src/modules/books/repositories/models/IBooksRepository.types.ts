import { IPaginationReturn } from './../../../../shared/interfaces/IPaginationResponse';
import { CreateBookDto } from '../../dto/create-book.dto';
import { FindBooksDto } from '../../dto/find-books.dto';
import { BookEntity } from '../../entities/book.entity';
import { FindUsersBooksDto } from '../../dto/find-users-books.dto';

interface IBooksRepository {
  create(bookDto: CreateBookDto): Promise<BookEntity>;
  find(
    dto: FindBooksDto,
    userId: string,
  ): Promise<IPaginationReturn<BookEntity>>;
  findByGoogleId(id: string): Promise<BookEntity>;
  findByUserId(
    userId: string,
    dto: FindUsersBooksDto,
  ): Promise<IPaginationReturn<BookEntity>>;
}

export { IBooksRepository };
