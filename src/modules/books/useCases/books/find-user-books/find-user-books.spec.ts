import { Test, TestingModule } from '@nestjs/testing';
import { IBooksRepository } from '../../../repositories/models/IBooksRepository.types';
import { FindUsersBooksDto } from '../../../dto/find-users-books.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BooksRepository } from '../../../../../modules/books/repositories/implementations/BooksRepository';
import { FindUserBooksUseCase } from './find-user-books';

describe('FindUserBooksUseCase', () => {
  let findUserBooksUseCase: FindUserBooksUseCase;
  let booksRepository: IBooksRepository;

  beforeEach(async () => {
    const FindUserBooksUseCaseProvider = {
      provide: FindUserBooksUseCase,
      useFactory: (booksRepository: IBooksRepository) => {
        return new FindUserBooksUseCase(booksRepository);
      },
      inject: [BooksRepository],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserBooksUseCaseProvider,
        {
          provide: BooksRepository,
          useValue: {
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    findUserBooksUseCase =
      module.get<FindUserBooksUseCase>(FindUserBooksUseCase);
    booksRepository = module.get<IBooksRepository>(BooksRepository);
  });

  describe('execute', () => {
    it('should call booksRepository.findByUserId with the provided parameters', async () => {
      const mockUserPayloadDto: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockFindUsersBooksDto: FindUsersBooksDto = {
        limit: 10,
        page: 1,
        search: 'Book Title',
      };

      await findUserBooksUseCase.execute(
        mockUserPayloadDto,
        mockFindUsersBooksDto,
      );

      expect(booksRepository.findByUserId).toHaveBeenCalledWith(
        mockUserPayloadDto.id,
        mockFindUsersBooksDto,
      );
    });

    it('should return the data from booksRepository.findByUserId', async () => {
      const mockUserPayloadDto: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockFindUsersBooksDto: FindUsersBooksDto = {
        limit: 10,
        page: 1,
        search: 'Book Title',
      };

      const mockBooksData = {
        data: [
          {
            id: 'book1',
            title: 'Book 1',
          },
          {
            id: 'book2',
            title: 'Book 2',
          },
        ],
        count: 2,
      };

      (booksRepository.findByUserId as jest.Mock).mockResolvedValue(
        mockBooksData,
      );

      const result = await findUserBooksUseCase.execute(
        mockUserPayloadDto,
        mockFindUsersBooksDto,
      );

      expect(result).toEqual(mockBooksData);
    });
  });
});
