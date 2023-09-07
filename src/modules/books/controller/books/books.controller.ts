import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../../../shared/decorators/public.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { SearchAllBooksDto } from '../../dto/search-all-books.dto';
import { SearchAllBooksUseCase } from '../../useCases/books/search-all-books/search-all-books';
import { FindBooksDto } from '../../dto/find-books.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FindUserBooksUseCase } from '../../useCases/books/find-user-books';
import { CreateBookDto } from '../../dto/create-book.dto';
import { FindBooksUseCase } from '../../useCases/books/find-books';
import { CreateUserBooksUseCase } from '../../useCases/books/create-user-books';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly searchBooksUseCase: SearchAllBooksUseCase,
    private readonly findUserBooksUseCase: FindUserBooksUseCase,
    private readonly findBooksUseCase: FindBooksUseCase,
    private readonly createUserBooksUseCase: CreateUserBooksUseCase,
  ) {}

  @Public()
  @Get('')
  async find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() findBooksDto: FindBooksDto,
  ) {
    const books = await this.findBooksUseCase.execute(
      userPayloadDto,
      findBooksDto,
    );

    return books;
  }

  @Get('user')
  async findUserBooks(
    @User() userPayloadDto: UserPayloadDto,
    @Query() findBooksDto: FindBooksDto,
  ) {
    const books = await this.findUserBooksUseCase.execute(
      userPayloadDto,
      findBooksDto,
    );

    return books;
  }

  @Public()
  @Get('search')
  @UseInterceptors(CacheInterceptor)
  async searchBooks(@Query() searchBooksDto: SearchAllBooksDto) {
    const books = await this.searchBooksUseCase.execute(searchBooksDto);

    return books;
  }

  @Post('user')
  async createUserBooks(
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
