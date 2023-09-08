import { Test, TestingModule } from '@nestjs/testing';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindBooksDto } from '../../../dto/find-books.dto';
import { IBooksRepository } from '../../../repositories/models/IBooksRepository.types';
import { BooksRepository } from '../../../../../modules/books/repositories/implementations/BooksRepository';
import { FindBooksUseCase } from './find-books';

describe('FindBooksUseCase', () => {
  let findBooksUseCase: FindBooksUseCase;
  let booksRepository: IBooksRepository;

  beforeEach(async () => {
    const FindBooksUseCaseProvider = {
      provide: FindBooksUseCase,
      useFactory: (booksRepository: IBooksRepository) => {
        return new FindBooksUseCase(booksRepository);
      },
      inject: [BooksRepository],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindBooksUseCaseProvider,
        {
          provide: BooksRepository,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    findBooksUseCase = module.get<FindBooksUseCase>(FindBooksUseCase);
    booksRepository = module.get<IBooksRepository>(BooksRepository);
  });

  describe('execute', () => {
    it('should call booksRepository.find with the provided parameters', async () => {
      const mockUserPayloadDto: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockFindBooksDto: FindBooksDto = {
        limit: 10,
        page: 1,
        search: 'Book Title',
      };

      await findBooksUseCase.execute(mockUserPayloadDto, mockFindBooksDto);

      expect(booksRepository.find).toHaveBeenCalledWith(
        mockFindBooksDto,
        mockUserPayloadDto?.id,
      );
    });

    it('should return the data from booksRepository.find', async () => {
      const mockUserPayloadDto: UserPayloadDto = {
        id: 'user123',
        email: 'user@example.com',
      };

      const mockFindBooksDto: FindBooksDto = {
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

      (booksRepository.find as jest.Mock).mockResolvedValue(mockBooksData);

      const result = await findBooksUseCase.execute(
        mockUserPayloadDto,
        mockFindBooksDto,
      );

      expect(result).toEqual(mockBooksData);
    });
  });
});
