import { Module } from '@nestjs/common';

import { FirebaseProvider } from '../../shared/providers/JwtProvider/implementations/FirebaseProvider';
import { AuthController } from './controller/session/auth.controller';
import { GoogleLoginUseCase } from './useCases/google-login';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { IUsersRepository } from './repositories/models/IUsersRepository.types';
import { IJwtProvider } from '../../shared/providers/JwtProvider/models/IJwtProvider.types';
import { FindUserByIdUseCase } from './useCases/find-user-by-id';

const GoogleLoginUseCaseProvider = {
  provide: GoogleLoginUseCase,
  useFactory: (
    UsersRepository: IUsersRepository,
    jwtProvider: IJwtProvider,
  ) => {
    return new GoogleLoginUseCase(UsersRepository, jwtProvider);
  },
  inject: [UsersRepository, FirebaseProvider],
};

const FindUserByGoogleIdUseCaseProvider = {
  provide: FindUserByIdUseCase,
  useFactory: (UsersRepository: IUsersRepository) => {
    return new FindUserByIdUseCase(UsersRepository);
  },
  inject: [UsersRepository],
};

@Module({
  controllers: [AuthController],
  providers: [
    FirebaseProvider,
    UsersRepository,
    FindUserByGoogleIdUseCaseProvider,
    GoogleLoginUseCaseProvider,
  ],
})
export class AuthModule {}
