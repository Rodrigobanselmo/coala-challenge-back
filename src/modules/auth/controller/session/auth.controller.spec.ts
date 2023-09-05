import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { GoogleLoginUseCase } from '../../useCases/google-login/google-login';
import { LoginGoogleUserDto } from '../../dto/login-user.dto';
import { UserEntity } from '../../entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let googleLoginUseCase: GoogleLoginUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: GoogleLoginUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    googleLoginUseCase = module.get<GoogleLoginUseCase>(GoogleLoginUseCase);
  });

  describe('google', () => {
    it('should be defined', () => {
      expect(authController).toBeDefined();
    });

    const mockLoginUserDto = new LoginGoogleUserDto();
    const mockUser = new UserEntity({
      id: 1,
      name: 'mockName',
      email: 'mockEmail',
    });

    it('should call googleLoginService with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(googleLoginUseCase, 'execute')
        .mockResolvedValue(mockUser);

      await authController.google(mockLoginUserDto);

      expect(executeSpy).toHaveBeenCalledWith(mockLoginUserDto);
    });

    it('should return the user returned by googleLoginService', async () => {
      jest.spyOn(googleLoginUseCase, 'execute').mockResolvedValue(mockUser);

      const result = await authController.google(mockLoginUserDto);

      expect(result).toEqual(mockUser);
    });

    it('should have the Public decorator', () => {
      const metadata = Reflect.getMetadata('isPublic', authController.google);

      expect(metadata).toBe(true);
    });
  });
});
