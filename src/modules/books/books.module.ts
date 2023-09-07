import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { BooksController } from './controller/books/books.controller';
import { SearchAllBooksUseCase } from './useCases/books/search-all-books';
import { IBooksRepository } from './repositories/models/IBooksRepository.types';
import { BooksRepository } from './repositories/implementations/BooksRepository';
import { CacheModule } from '@nestjs/cache-manager';
import { FindUserBooksUseCase } from './useCases/books/find-user-books';
import { UsersBooksRepository } from './repositories/implementations/UsersBooksRepository';
import { IUsersBooksRepository } from './repositories/models/IUsersBooksRepository.types';
import { FindBooksUseCase } from './useCases/books/find-books';
import { CreateUserBooksUseCase } from './useCases/books/create-user-books';
import { UsersBooksExchangeRepository } from './repositories/implementations/UsersBooksExchangeRepository';
import { CreateBookExchangeUseCase } from './useCases/books-exchange/create-book-exchange';
import { IUsersBookExchangeRepository } from './repositories/models/IUsersBookExchangeRepository.types';
import { FindBooksExchangeUseCase } from './useCases/books-exchange/find-books-exchange';
import { BooksExchangeController } from './controller/books-exchange/books-exchange.controller';

const FindBooksUseCaseProvider = {
  provide: FindUserBooksUseCase,
  useFactory: (booksRepository: IBooksRepository) => {
    return new FindUserBooksUseCase(booksRepository);
  },
  inject: [BooksRepository],
};

const FindUserBooksUseCaseProvider = {
  provide: FindBooksUseCase,
  useFactory: (booksRepository: IBooksRepository) => {
    return new FindBooksUseCase(booksRepository);
  },
  inject: [BooksRepository],
};

const CreateUserBooksUseCaseProvider = {
  provide: CreateUserBooksUseCase,
  useFactory: (
    booksRepository: IBooksRepository,
    usersBooksRepository: IUsersBooksRepository,
  ) => {
    return new CreateUserBooksUseCase(booksRepository, usersBooksRepository);
  },
  inject: [BooksRepository, UsersBooksRepository],
};

const CreateBookExchangeUseCaseProvider = {
  provide: CreateBookExchangeUseCase,
  useFactory: (
    usersBookExchangeRepository: IUsersBookExchangeRepository,
    usersBooksRepository: IUsersBooksRepository,
  ) => {
    return new CreateBookExchangeUseCase(
      usersBookExchangeRepository,
      usersBooksRepository,
    );
  },
  inject: [UsersBooksExchangeRepository, UsersBooksRepository],
};

const FindBooksExchangeUseCaseProvider = {
  provide: FindBooksExchangeUseCase,
  useFactory: (usersBookExchangeRepository: IUsersBookExchangeRepository) => {
    return new FindBooksExchangeUseCase(usersBookExchangeRepository);
  },
  inject: [UsersBooksExchangeRepository, UsersBooksRepository],
};

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [BooksController, BooksExchangeController],
  providers: [
    SearchAllBooksUseCase,
    BooksRepository,
    UsersBooksRepository,
    UsersBooksExchangeRepository,
    FindBooksUseCaseProvider,
    FindUserBooksUseCaseProvider,
    CreateUserBooksUseCaseProvider,
    CreateBookExchangeUseCaseProvider,
    FindBooksExchangeUseCaseProvider,
  ],
})
export class BooksModule {}
