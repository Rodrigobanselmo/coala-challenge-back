import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { User } from '../../../../shared/decorators/user.decorator';
import { CreateUserBookExchangeDto } from '../../dto/create-user-book-exchange.dto';
import { FindUsersBooksExchangeDto } from '../../dto/find-users-books-exchange.dto';
import { CreateBookExchangeUseCase } from '../../useCases/books-exchange/create-book-exchange';
import { FindBooksExchangeUseCase } from '../../useCases/books-exchange/find-books-exchange';

@ApiTags('Books')
@Controller('books-exchange')
export class BooksExchangeController {
  constructor(
    private readonly findBooksExchangeUseCase: FindBooksExchangeUseCase,
    private readonly createBookExchangeUseCase: CreateBookExchangeUseCase,
  ) {}

  @Get()
  async find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() findExchangeBooksDto: FindUsersBooksExchangeDto,
  ) {
    const books = await this.findBooksExchangeUseCase.execute(
      userPayloadDto,
      findExchangeBooksDto,
    );

    return books;
  }

  @Post('create-interest')
  async createInterest(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createExchangeDto: CreateUserBookExchangeDto,
  ) {
    const books = await this.createBookExchangeUseCase.execute(
      userPayloadDto,
      createExchangeDto,
    );

    return books;
  }

  // @Post('add-asking-book')
  // async addAskBooking(
  //   @User() userPayloadDto: UserPayloadDto,
  //   @Body() createBookDto: CreateBookDto,
  // ) {
  //   const books = await this.createUserBooksUseCase.execute(
  //     userPayloadDto,
  //     createBookDto,
  //   );

  //   return books;
  // }

  // @Post('confirm-exchange')
  // async confirmExchange(
  //   @User() userPayloadDto: UserPayloadDto,
  //   @Body() createBookDto: CreateBookDto,
  // ) {
  //   const books = await this.createUserBooksUseCase.execute(
  //     userPayloadDto,
  //     createBookDto,
  //   );

  //   return books;
  // }
}
