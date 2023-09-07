import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { User } from '../../../../shared/decorators/user.decorator';
import { CreateBookDto } from '../../dto/create-book.dto';
import { FindBooksDto } from '../../dto/find-books.dto';
import { FindUserBooksUseCase } from '../../useCases/books/find-user-books';
import { SearchAllBooksUseCase } from '../../useCases/books/search-all-books/search-all-books';
import { FindBooksUseCase } from '../../useCases/books/find-books';
import { CreateUserBooksUseCase } from '../../useCases/books/create-user-books';

@ApiTags('Books')
@Controller('books-exchange')
export class BooksController {
  constructor(
    private readonly searchBooksUseCase: SearchAllBooksUseCase,
    private readonly findUserBooksUseCase: FindUserBooksUseCase,
    private readonly findBooksUseCase: FindBooksUseCase,
    private readonly createUserBooksUseCase: CreateUserBooksUseCase,
  ) {}

  @Get()
  async find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() findBooksDto: FindBooksDto,
  ) {
    const books = await this.findBooksUseCase.execute(findBooksDto);

    return books;
  }

  @Post('add-interest')
  async addInterest(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createBookDto: CreateBookDto,
  ) {
    const books = await this.createUserBooksUseCase.execute(
      userPayloadDto,
      createBookDto,
    );

    return books;
  }

  @Post('add-asking-book')
  async addAskBooking(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createBookDto: CreateBookDto,
  ) {
    const books = await this.createUserBooksUseCase.execute(
      userPayloadDto,
      createBookDto,
    );

    return books;
  }

  @Post('confirm-exchange')
  async confirmExchange(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createBookDto: CreateBookDto,
  ) {
    const books = await this.createUserBooksUseCase.execute(
      userPayloadDto,
      createBookDto,
    );

    return books;
  }
}
