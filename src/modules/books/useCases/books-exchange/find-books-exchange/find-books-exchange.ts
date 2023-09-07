import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindUsersBooksExchangeDto } from '../../../dto/find-users-books-exchange.dto';
import { IUsersBookExchangeRepository } from '../../../repositories/models/IUsersBookExchangeRepository.types';

@Injectable()
export class FindBooksExchangeUseCase {
  constructor(
    private readonly booksExchangeRepository: IUsersBookExchangeRepository,
  ) {}

  async execute(
    user: UserPayloadDto,
    findUsersBooksDto: FindUsersBooksExchangeDto,
  ) {
    const data = await this.booksExchangeRepository.find(
      user.id,
      findUsersBooksDto,
    );

    return data;
  }
}
