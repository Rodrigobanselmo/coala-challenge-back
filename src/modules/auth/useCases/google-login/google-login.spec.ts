/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseProvider } from '../../../../shared/providers/JwtProvider/implementations/FirebaseProvider';
import { IJwtProvider } from '../../../../shared/providers/JwtProvider/models/IJwtProvider.types';
import { LoginGoogleUserDto } from '../../dto/login-user.dto';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';
import { IUsersRepository } from '../../repositories/models/IUsersRepository.types';
import { GoogleLoginUseCase } from './google-login';
import { UserEntity } from '../../entities/user.entity';

describe('GoogleLoginUseCase', () => {
  let googleLoginUseCase: GoogleLoginUseCase;
  let usersRepository: IUsersRepository;
  let jwtProvider: IJwtProvider;

  beforeEach(async () => {
    const GoogleLoginUseCaseProvider = {
      provide: GoogleLoginUseCase,
      useFactory: (
        firebaseProvider: IJwtProvider,
        UsersRepository: IUsersRepository,
      ) => {
        return new GoogleLoginUseCase(UsersRepository, firebaseProvider);
      },
      inject: [FirebaseProvider, UsersRepository],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleLoginUseCaseProvider,
        {
          provide: UsersRepository,
          useValue: {
            findByGoogleExternalId: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: FirebaseProvider,
          useValue: {
            validateGoogleToken: jest.fn(),
          },
        },
      ],
    }).compile();

    googleLoginUseCase = module.get<GoogleLoginUseCase>(GoogleLoginUseCase);
    usersRepository = module.get<IUsersRepository>(UsersRepository);
    jwtProvider = module.get<IJwtProvider>(FirebaseProvider);
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(googleLoginUseCase).toBeDefined();
    });

    const mockGoogleToken = 'mockGoogleToken';
    const mockUser = {
      uid: 'mockUid',
      email: 'test@example.com',
      photoURL: 'https://example.com/photo.jpg',
      displayName: 'Test User',
    };
    const mockLoginGoogleUserDto: LoginGoogleUserDto = {
      token: mockGoogleToken,
    };

    const mockEntityUser = new UserEntity({
      id: 'fake_id',
      name: 'mockName',
      email: 'mockEmail',
    });

    it('should call firebaseProvider.validateGoogleToken with the correct token', async () => {
      const validateSpy = jest
        .spyOn(jwtProvider, 'validateToken')
        .mockResolvedValue(mockUser);

      await googleLoginUseCase.execute(mockLoginGoogleUserDto);

      expect(validateSpy).toHaveBeenCalledWith(mockGoogleToken);
    });

    it('should call usersRepository.findByGoogleExternalId if user exists', async () => {
      jest.spyOn(jwtProvider, 'validateToken').mockResolvedValue(mockUser);

      const findByGoogleExternalIdSpy = jest
        .spyOn(usersRepository, 'findById')
        .mockResolvedValue(mockEntityUser);

      await googleLoginUseCase.execute(mockLoginGoogleUserDto);

      expect(findByGoogleExternalIdSpy).toHaveBeenCalledWith(mockUser.uid);
    });

    it('should call usersRepository.create if user does not exist', async () => {
      jest.spyOn(jwtProvider, 'validateToken').mockResolvedValue(mockUser);

      jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

      const createSpy = jest
        .spyOn(usersRepository, 'create')
        .mockResolvedValue(mockEntityUser);

      await googleLoginUseCase.execute(mockLoginGoogleUserDto);

      expect(createSpy).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.uid,
        photoUrl: mockUser.photoURL,
        name: mockUser.displayName,
      });
    });

    it('should return the user if found or created', async () => {
      jest.spyOn(jwtProvider, 'validateToken').mockResolvedValue(mockUser);

      jest.spyOn(usersRepository, 'findById').mockResolvedValue(mockEntityUser);

      const result = await googleLoginUseCase.execute(mockLoginGoogleUserDto);

      expect(result).toEqual(mockEntityUser);
    });

    it('should throw BadRequestException if there is an error', async () => {
      jest
        .spyOn(jwtProvider, 'validateToken')
        .mockRejectedValue(new Error('Google validation error'));

      await expect(
        googleLoginUseCase.execute(mockLoginGoogleUserDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
