import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorEnum } from '../../../../shared/constants/enums/errorMessage';
import { FindUserByIdDto } from '../../dto/find-me.dto';
import { IUsersRepository } from '../../repositories/models/IUsersRepository.types';
// import { UsersRepository } from '../../repositories/implementations/UsersRepository';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ id }: FindUserByIdDto) {
    try {
      const user = await this.usersRepository.findById(id);

      return user;
    } catch (error) {
      throw new BadRequestException(ErrorEnum.FIND_USER_ERROR);
    }
  }
}
