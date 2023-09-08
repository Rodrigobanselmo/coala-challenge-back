import { Test, TestingModule } from '@nestjs/testing';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindUsersBooksExchangeDto } from '../../../dto/find-users-books-exchange.dto';
import { IUsersBookExchangeRepository } from '../../../repositories/models/IUsersBookExchangeRepository.types';
import { UsersBooksExchangeRepository } from '../../../../../modules/books/repositories/implementations/UsersBooksExchangeRepository';
import { FindBooksExchangeUseCase } from './find-books-exchange';

describe('FindBooksExchangeUseCase', () => {
  let findBooksExchangeUseCase: FindBooksExchangeUseCase;
  let booksExchangeRepository: IUsersBookExchangeRepository;

  beforeEach(async () => {
    const FindBooksExchangeUseCaseProvider = {
      provide: FindBooksExchangeUseCase,
      useFactory: (booksExchangeRepository: IUsersBookExchangeRepository) => {
        return new FindBooksExchangeUseCase(booksExchangeRepository);
      },
      inject: [UsersBooksExchangeRepository],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindBooksExchangeUseCaseProvider,
        {
          provide: UsersBooksExchangeRepository,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    findBooksExchangeUseCase = module.get<FindBooksExchangeUseCase>(
      FindBooksExchangeUseCase,
    );
    booksExchangeRepository = module.get<IUsersBookExchangeRepository>(
      UsersBooksExchangeRepository,
    );
  });

  describe('execute', () => {
    it('should return book exchange data', async () => {
      const mockUser: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockFindUsersBooksDto: FindUsersBooksExchangeDto = {
        search: 'Book search',
        page: 1,
        limit: 10,
      };

      const mockBookExchangeData = {
        count: 0,
      };

      (booksExchangeRepository.find as jest.Mock).mockResolvedValue(
        mockBookExchangeData,
      );

      const result = await findBooksExchangeUseCase.execute(
        mockUser,
        mockFindUsersBooksDto,
      );

      expect(result).toEqual(mockBookExchangeData);

      expect(booksExchangeRepository.find).toHaveBeenCalledWith(
        mockUser.id,
        mockFindUsersBooksDto,
      );
    });
  });
});
