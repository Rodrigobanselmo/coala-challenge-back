import { CreateUserBookDto } from '../../dto/create-user-book.dto';
import { UsersBooksEntity } from '../../entities/user-book.entity';

interface IUsersBooksRepository {
  create(userId: string, bookDto: CreateUserBookDto): Promise<UsersBooksEntity>;
  findAvailableBooks(
    userId: string,
    bookId: number,
  ): Promise<UsersBooksEntity[]>;
}

export { IUsersBooksRepository };
