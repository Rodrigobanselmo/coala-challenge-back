import { Injectable } from '@nestjs/common';
import { IUsersBookExchangeRepository } from '../../../repositories/models/IUsersBookExchangeRepository.types';
import { IUsersBooksRepository } from '../../../repositories/models/IUsersBooksRepository.types';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindUsersBooksDto } from '../../../dto/find-users-books.dto';

@Injectable()
export class FindBooksExchangeUseCase {
  constructor(
    private readonly booksExchangeRepository: IUsersBookExchangeRepository,
    private readonly usersBooksRepository: IUsersBooksRepository,
  ) {}

  async execute(user: UserPayloadDto, findUsersBooksDto: FindUsersBooksDto) {
    // const data = await this.booksRepository.findByUserId(
    //   user.id,
    //   findUsersBooksDto,
    // );
    // return data;
  }
}
