import { LoginGoogleUserDto } from '../../dto/login-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorAuthEnum } from '../../../../shared/constants/enums/errorMessage';
import { IUsersRepository } from '../../repositories/models/IUsersRepository.types';
import { IFirebaseProvider } from '../../../../shared/providers/FirebaseProvider/models/IFirebaseProvider.types';
// import { UsersRepository } from '../../repositories/implementations/UsersRepository';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly firebaseProvider: IFirebaseProvider,
  ) {}

  async execute({ googleToken }: LoginGoogleUserDto) {
    try {
      const result =
        await this.firebaseProvider.validateGoogleToken(googleToken);

      let user = await this.usersRepository.findByGoogleExternalId(
        result.user.uid,
      );

      if (!user?.id) {
        user = await this.usersRepository.create({
          email: result.user.email,
          googleExternalId: result.user.uid,
          photoUrl: result.user.photoURL,
          name: result.user.displayName,
        });
      }

      return user;
    } catch (error) {
      throw new BadRequestException(ErrorAuthEnum.GOOGLE_USER_ERROR);
    }
  }
}
