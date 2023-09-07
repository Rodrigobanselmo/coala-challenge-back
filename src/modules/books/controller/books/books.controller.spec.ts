import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { SearchAllBooksUseCase } from '../../useCases/books/search-all-books/search-all-books';
import { SearchAllBooksDto } from '../../dto/search-all-books.dto';
import { GoogleBooksResponseDto } from '../../interfaces/google-books-response.types';

describe('BooksController', () => {
  let booksController: BooksController;
  let searchBooksUseCase: SearchAllBooksUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: SearchAllBooksUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
    searchBooksUseCase = module.get<SearchAllBooksUseCase>(
      SearchAllBooksUseCase,
    );
  });

  describe('searchBooks', () => {
    it('should be defined', () => {
      expect(booksController).toBeDefined();
    });

    const mockSearchBooksDto: SearchAllBooksDto = {};
    const mockSearchResult: GoogleBooksResponseDto[] = [];

    it('should call searchBooksUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(searchBooksUseCase, 'execute')
        .mockResolvedValue(mockSearchResult);

      await booksController.searchBooks(mockSearchBooksDto);

      expect(executeSpy).toHaveBeenCalledWith(mockSearchBooksDto);
    });

    it('should return the result returned by searchBooksUseCase', async () => {
      jest
        .spyOn(searchBooksUseCase, 'execute')
        .mockResolvedValue(mockSearchResult);

      const result = await booksController.searchBooks(mockSearchBooksDto);

      expect(result).toEqual(mockSearchResult);
    });

    it('should have the Public decorator', () => {
      const metadata = Reflect.getMetadata(
        'isPublic',
        booksController.searchBooks,
      );

      expect(metadata).toBe(true);
    });
  });
});
