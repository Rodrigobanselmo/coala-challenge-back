import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateBookDto } from '../../../dto/create-book.dto';
import { IBooksRepository } from '../../../repositories/models/IBooksRepository.types';
import { IUsersBooksRepository } from '../../../repositories/models/IUsersBooksRepository.types';

@Injectable()
export class CreateUserBooksUseCase {
  constructor(
    private readonly booksRepository: IBooksRepository,
    private readonly usersBooksRepository: IUsersBooksRepository,
  ) {}

  async execute(user: UserPayloadDto, createBookDto: CreateBookDto) {
    let book = await this.booksRepository.findByGoogleId(
      createBookDto.googleId,
    );

    if (!book) {
      book = await this.booksRepository.create(createBookDto);
    }

    await this.usersBooksRepository.create(user.id, {
      bookId: book.id,
      userId: user.id,
    });

    return book;
  }
}
