import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthGuard } from './shared/guards/auth.guard';
import { FirebaseProvider } from './shared/providers/JwtProvider/implementations/FirebaseProvider';
import { IJwtProvider } from './shared/providers/JwtProvider/models/IJwtProvider.types';

const AuthGuardProvider = {
  provide: APP_GUARD,
  useFactory: (jwtProvider: IJwtProvider, reflector: Reflector) => {
    return new AuthGuard(jwtProvider, reflector);
  },
  inject: [FirebaseProvider, Reflector],
};

@Module({
  imports: [
    ThrottlerModule.forRoot({ throttlers: [{ limit: 10, ttl: 60 }] }),
    PrismaModule,
    AuthModule,
    BooksModule,
  ],
  providers: [FirebaseProvider, AuthGuardProvider],
})
export class AppModule {}
