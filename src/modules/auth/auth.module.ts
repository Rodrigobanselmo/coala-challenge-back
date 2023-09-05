import { Module } from '@nestjs/common';

import { FirebaseProvider } from '../../shared/providers/FirebaseProvider/implementations/FirebaseProvider';
import { AuthController } from './controller/session/auth.controller';
import { GoogleLoginUseCase } from './useCases/google-login';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { IUsersRepository } from './repositories/models/IUsersRepository.types';
import { IFirebaseProvider } from '../../shared/providers/FirebaseProvider/models/IFirebaseProvider.types';

const GoogleLoginUseCaseProvider = {
  provide: GoogleLoginUseCase,
  useFactory: (
    UsersRepository: IUsersRepository,
    firebaseProvider: IFirebaseProvider,
  ) => {
    return new GoogleLoginUseCase(UsersRepository, firebaseProvider);
  },
  inject: [FirebaseProvider, UsersRepository],
};

@Module({
  controllers: [AuthController],
  providers: [FirebaseProvider, UsersRepository, GoogleLoginUseCaseProvider],
})
export class AuthModule {}
