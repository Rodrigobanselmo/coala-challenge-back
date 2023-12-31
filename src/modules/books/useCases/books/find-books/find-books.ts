import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { FindBooksDto } from '../../../dto/find-books.dto';
import { IBooksRepository } from '../../../repositories/models/IBooksRepository.types';

@Injectable()
export class FindBooksUseCase {
  constructor(private readonly booksRepository: IBooksRepository) {}

  async execute(userPayloadDto: UserPayloadDto, findBooksDto: FindBooksDto) {
    const data = await this.booksRepository.find(
      findBooksDto,
      userPayloadDto?.id,
    );
    return data;
  }
}
