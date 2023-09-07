import { IPaginationReturn } from 'src/shared/interfaces/IPaginationResponse';
import { CreateUserBookExchangeDto } from '../../dto/create-user-book-exchange.dto';
import { FindUserBookExchangeDto } from '../../dto/find-user-book-exchange.dto';
import { FindUsersBooksExchangeDto } from '../../dto/find-users-books-exchange.dto';
import { UpdateUserBookExchangeDto } from '../../dto/update-user-book-exchange.dto';
import { UsersBooksExchangeEntity } from '../../entities/user-book-exchange.entity';

interface IUsersBookExchangeRepository {
  create(bookDto: CreateUserBookExchangeDto): Promise<UsersBooksExchangeEntity>;
  createMany(bookDto: CreateUserBookExchangeDto[]): Promise<void>;
  update(
    id: number,
    bookDto: UpdateUserBookExchangeDto,
  ): Promise<UsersBooksExchangeEntity>;
  find(
    userId: string,
    dto: FindUsersBooksExchangeDto,
  ): Promise<IPaginationReturn<UsersBooksExchangeEntity>>;
  findByUsersBooksIds(
    dto: FindUserBookExchangeDto,
  ): Promise<UsersBooksExchangeEntity>;
}

export { IUsersBookExchangeRepository };
