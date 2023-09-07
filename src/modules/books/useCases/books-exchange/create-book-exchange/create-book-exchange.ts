import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorEnum } from '../../../../../shared/constants/enums/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { IUsersBookExchangeRepository } from '../../../repositories/models/IUsersBookExchangeRepository.types';
import { IUsersBooksRepository } from '../../../repositories/models/IUsersBooksRepository.types';
import { CreateUserBookExchangeDto } from './../../../dto/create-user-book-exchange.dto';

@Injectable()
export class CreateBookExchangeUseCase {
  constructor(
    private readonly booksExchangeRepository: IUsersBookExchangeRepository,
    private readonly usersBooksRepository: IUsersBooksRepository,
  ) {}

  async execute(
    user: UserPayloadDto,
    createBookDto: CreateUserBookExchangeDto,
  ) {
    const exchangeAlreadyExists =
      await this.booksExchangeRepository.findByUsersBooksIds({
        interestBookId: createBookDto.interestBookId,
        interetUserId: user.id,
      });

    if (exchangeAlreadyExists) {
      throw new BadRequestException(ErrorEnum.EXCHANGE_EXISTS);
    }

    const userBooksFound = await this.usersBooksRepository.findAvailableBooks(
      user.id,
      createBookDto.interestBookId,
    );

    if (!userBooksFound.length) {
      throw new BadRequestException(ErrorEnum.BOOK_NOT_FOUND);
    }

    await this.booksExchangeRepository.createMany(
      userBooksFound.map((userBook) => ({
        interetUserId: user.id,
        interestBookId: userBook.bookId,
        targetUserId: userBook.userId,
      })),
    );
  }
}
