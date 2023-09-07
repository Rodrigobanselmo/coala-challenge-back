import { LoginGoogleUserDto } from '../../dto/login-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorEnum } from '../../../../shared/constants/enums/errorMessage';
import { IUsersRepository } from '../../repositories/models/IUsersRepository.types';
import { IJwtProvider } from '../../../../shared/providers/JwtProvider/models/IJwtProvider.types';
// import { UsersRepository } from '../../repositories/implementations/UsersRepository';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly jwtProvider: IJwtProvider,
  ) {}

  async execute({ token }: LoginGoogleUserDto) {
    try {
      const result = await this.jwtProvider.validateToken(token);

      let user = await this.usersRepository.findById(result.uid);
      if (!user?.id) {
        user = await this.usersRepository.create({
          email: result.email,
          id: result.uid,
          photoUrl: result.photoURL,
          name: result.displayName,
        });
      }

      return user;
    } catch (error) {
      throw new BadRequestException(ErrorEnum.GOOGLE_USER_ERROR);
    }
  }
}
