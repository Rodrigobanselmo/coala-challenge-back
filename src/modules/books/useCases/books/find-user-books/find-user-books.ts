import { Injectable } from '@nestjs/common';
import { IBooksRepository } from '../../../repositories/models/IBooksRepository.types';
import { FindUsersBooksDto } from '../../../dto/find-users-books.dto';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class FindUserBooksUseCase {
  constructor(private readonly booksRepository: IBooksRepository) {}

  async execute(user: UserPayloadDto, findUsersBooksDto: FindUsersBooksDto) {
    const data = await this.booksRepository.findByUserId(
      user.id,
      findUsersBooksDto,
    );
    return data;
  }
}
