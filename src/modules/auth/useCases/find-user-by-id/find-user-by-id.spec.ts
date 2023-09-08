import { Test, TestingModule } from '@nestjs/testing';
import { IUsersRepository } from '../../repositories/models/IUsersRepository.types';
import { BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';
import { UserEntity } from '../../entities/user.entity';
import { FindUserByIdUseCase } from './find-user-by-id';

describe('FindUserByIdUseCase', () => {
  let findUserByIdUseCase: FindUserByIdUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(async () => {
    const usersRepositoryMock: Partial<IUsersRepository> = {
      findById: jest.fn(),
    };

    const FindUserByIdUseCaseProvider = {
      provide: FindUserByIdUseCase,
      useFactory: (UsersRepository: IUsersRepository) => {
        return new FindUserByIdUseCase(UsersRepository);
      },
      inject: [UsersRepository],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdUseCaseProvider,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    findUserByIdUseCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase);
    usersRepository = module.get<IUsersRepository>(UsersRepository);
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(findUserByIdUseCase).toBeDefined();
    });

    const mockUser = new UserEntity({
      id: 'mock-user-id',
    });

    const mockUserId = mockUser.id;

    it('should call usersRepository.findById with the correct parameters', async () => {
      const findByIdSpy = jest
        .spyOn(usersRepository, 'findById')
        .mockResolvedValue(mockUser);

      await findUserByIdUseCase.execute({ id: mockUserId });

      expect(findByIdSpy).toHaveBeenCalledWith(mockUserId);
    });

    it('should return the user if found', async () => {
      jest.spyOn(usersRepository, 'findById').mockResolvedValue(mockUser);

      const result = await findUserByIdUseCase.execute({ id: mockUserId });

      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user is not found', async () => {
      jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

      await expect(
        findUserByIdUseCase.execute({ id: mockUserId }),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
