import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorEnum } from '../../../../../shared/constants/enums/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { IUsersBookExchangeRepository } from '../../../repositories/models/IUsersBookExchangeRepository.types';
import { IUsersBooksRepository } from '../../../repositories/models/IUsersBooksRepository.types';
import { CreateUserBookExchangeDto } from './../../../dto/create-user-book-exchange.dto';
import { CreateBookExchangeUseCase } from './create-book-exchange';
import { UsersBooksRepository } from '../../../../../modules/books/repositories/implementations/UsersBooksRepository';
import { UsersBooksExchangeRepository } from '../../../../../modules/books/repositories/implementations/UsersBooksExchangeRepository';

describe('CreateBookExchangeUseCase', () => {
  let createBookExchangeUseCase: CreateBookExchangeUseCase;
  let booksExchangeRepository: IUsersBookExchangeRepository;
  let usersBooksRepository: IUsersBooksRepository;

  beforeEach(async () => {
    const CreateBookExchangeUseCaseProvider = {
      provide: CreateBookExchangeUseCase,
      useFactory: (
        booksExchangeRepository: IUsersBookExchangeRepository,
        usersBooksRepository: IUsersBooksRepository,
      ) => {
        return new CreateBookExchangeUseCase(
          booksExchangeRepository,
          usersBooksRepository,
        );
      },
      inject: [UsersBooksExchangeRepository, UsersBooksRepository],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBookExchangeUseCaseProvider,
        {
          provide: UsersBooksExchangeRepository,
          useValue: {
            findByUsersBooksIds: jest.fn(),
            createMany: jest.fn(),
          },
        },
        {
          provide: UsersBooksRepository,
          useValue: {
            findAvailableBooks: jest.fn(),
          },
        },
      ],
    }).compile();

    createBookExchangeUseCase = module.get<CreateBookExchangeUseCase>(
      CreateBookExchangeUseCase,
    );
    booksExchangeRepository = module.get<IUsersBookExchangeRepository>(
      UsersBooksExchangeRepository,
    );
    usersBooksRepository =
      module.get<IUsersBooksRepository>(UsersBooksRepository);
  });

  describe('execute', () => {
    it('should create book exchanges and return nothing when conditions are met', async () => {
      const mockUser: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockCreateBookExchangeDto: CreateUserBookExchangeDto = {
        interestBookId: 1,
        interetUserId: 'user123',
      };

      const mockExchangeExists = null;
      const mockUserBooksFound = [{ bookId: 'book789', userId: 'user123' }];

      (
        booksExchangeRepository.findByUsersBooksIds as jest.Mock
      ).mockResolvedValue(mockExchangeExists);

      (usersBooksRepository.findAvailableBooks as jest.Mock).mockResolvedValue(
        mockUserBooksFound,
      );

      await createBookExchangeUseCase.execute(
        mockUser,
        mockCreateBookExchangeDto,
      );

      expect(booksExchangeRepository.findByUsersBooksIds).toHaveBeenCalledWith({
        interestBookId: mockCreateBookExchangeDto.interestBookId,
        interetUserId: mockUser.id,
      });

      expect(usersBooksRepository.findAvailableBooks).toHaveBeenCalledWith(
        mockUser.id,
        mockCreateBookExchangeDto.interestBookId,
      );

      expect(booksExchangeRepository.createMany).toHaveBeenCalledWith(
        mockUserBooksFound.map((userBook) => ({
          interetUserId: mockUser.id,
          interestBookId: userBook.bookId,
          targetUserId: userBook.userId,
        })),
      );
    });

    it('should throw a BadRequestException when exchange already exists', async () => {
      const mockUser: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockCreateBookExchangeDto: CreateUserBookExchangeDto = {
        interestBookId: 2,
        interetUserId: 'user123',
      };

      const mockExchangeExists = {
        id: 'exchange123',
      };

      (
        booksExchangeRepository.findByUsersBooksIds as jest.Mock
      ).mockResolvedValue(mockExchangeExists);

      async function executeAndCatchError() {
        await createBookExchangeUseCase.execute(
          mockUser,
          mockCreateBookExchangeDto,
        );
      }

      await expect(executeAndCatchError()).rejects.toThrow(
        new BadRequestException(ErrorEnum.EXCHANGE_EXISTS),
      );
    });

    it('should throw a BadRequestException when no user books are found', async () => {
      const mockUser: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockCreateBookExchangeDto: CreateUserBookExchangeDto = {
        interestBookId: 2,
        interetUserId: 'user123',
      };

      const mockExchangeExists = null;
      const mockUserBooksFound = [];

      (
        booksExchangeRepository.findByUsersBooksIds as jest.Mock
      ).mockResolvedValue(mockExchangeExists);

      (usersBooksRepository.findAvailableBooks as jest.Mock).mockResolvedValue(
        mockUserBooksFound,
      );

      async function executeAndCatchError() {
        await createBookExchangeUseCase.execute(
          mockUser,
          mockCreateBookExchangeDto,
        );
      }

      await expect(executeAndCatchError()).rejects.toThrow(
        new BadRequestException(ErrorEnum.BOOK_NOT_FOUND),
      );
    });
  });
});
