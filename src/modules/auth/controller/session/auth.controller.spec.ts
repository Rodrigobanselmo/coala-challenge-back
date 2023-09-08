import { Test, TestingModule } from '@nestjs/testing';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { LoginGoogleUserDto } from '../../dto/login-user.dto';
import { UserEntity } from '../../entities/user.entity';
import { FindUserByIdUseCase } from '../../useCases/find-user-by-id';
import { GoogleLoginUseCase } from '../../useCases/google-login/google-login';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let googleLoginUseCase: GoogleLoginUseCase;
  let findUserByIdUseCase: FindUserByIdUseCase;

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
        {
          provide: FindUserByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    googleLoginUseCase = module.get<GoogleLoginUseCase>(GoogleLoginUseCase);
    findUserByIdUseCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase);
  });

  const userPayload: UserPayloadDto = {
    id: 'test',
    email: 'test@example.com',
  };

  const mockUser = new UserEntity({
    id: 'test',
    name: 'mockName',
    email: 'mockEmail',
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('findMe', () => {
    it('should call findUserByIdUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(findUserByIdUseCase, 'execute')
        .mockResolvedValue(mockUser);

      await authController.findMe(userPayload);

      expect(executeSpy).toHaveBeenCalledWith({ id: userPayload.id });
    });

    it('should return the result returned by findUserByIdUseCase', async () => {
      jest.spyOn(findUserByIdUseCase, 'execute').mockResolvedValue(mockUser);

      const result = await authController.findMe(userPayload);

      expect(result).toEqual(mockUser);
    });
  });

  describe('googleLogin', () => {
    const loginUserDto: LoginGoogleUserDto = {
      token: 'mockToken',
    };

    it('should call googleLoginUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(googleLoginUseCase, 'execute')
        .mockResolvedValue(mockUser);

      await authController.googleLogin(loginUserDto);

      expect(executeSpy).toHaveBeenCalledWith(loginUserDto);
    });

    it('should return the result returned by googleLoginUseCase', async () => {
      jest.spyOn(googleLoginUseCase, 'execute').mockResolvedValue(mockUser);

      const result = await authController.googleLogin(loginUserDto);

      expect(result).toEqual(mockUser);
    });

    it('should have the Public decorator', () => {
      const metadata = Reflect.getMetadata(
        'isPublic',
        authController.googleLogin,
      );

      expect(metadata).toBe(true);
    });
  });
});
