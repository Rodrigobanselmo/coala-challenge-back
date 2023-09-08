import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateBookDto } from '../../dto/create-book.dto';
import { FindBooksDto } from '../../dto/find-books.dto';
import { FindUsersBooksDto } from '../../dto/find-users-books.dto';
import { BookEntity } from '../../entities/book.entity';
import { BooksRepository } from './BooksRepository';

describe('BooksRepository', () => {
  let booksRepository: BooksRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksRepository,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            book: {
              count: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    booksRepository = module.get<BooksRepository>(BooksRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('find', () => {
    it('should find and return books based on search criteria', async () => {
      const mockFindBooksDto: FindBooksDto = {
        limit: 20,
        page: 1,
        search: 'book title',
      };

      const mockUserId = 'user123';

      const mockResponse = [100, [{ id: 1, title: 'Book 1' }]] satisfies [
        number,
        unknown,
      ];

      (prismaService.$transaction as jest.Mock).mockResolvedValue(mockResponse);

      const result = await booksRepository.find(mockFindBooksDto, mockUserId);

      expect(result.count).toBe(mockResponse[0]);
      expect(result.data).toEqual(
        mockResponse[1].map((book) => new BookEntity(book)),
      );
    });

    it('should return an empty array if no books are found', async () => {
      const mockFindBooksDto: FindBooksDto = {
        limit: 20,
        page: 1,
        search: 'non-existing book title',
      };

      const mockUserId = 'user123';

      const mockResponse = [0, []];

      (prismaService.$transaction as jest.Mock).mockResolvedValue(mockResponse);

      const result = await booksRepository.find(mockFindBooksDto, mockUserId);

      expect(result.count).toBe(mockResponse[0]);
      expect(result.data).toEqual([]);
    });
  });

  describe('findByUserId', () => {
    it('should find and return books by user ID', async () => {
      const mockUserId = 'user123';
      const mockFindUsersBooksDto: FindUsersBooksDto = {
        limit: 10,
        page: 1,
        search: 'user book title',
      };

      const mockResponse = [100, [{ id: 1, title: 'Book 1' }]] satisfies [
        number,
        unknown,
      ];

      (prismaService.$transaction as jest.Mock).mockResolvedValue(mockResponse);

      const result = await booksRepository.findByUserId(
        mockUserId,
        mockFindUsersBooksDto,
      );

      expect(result.count).toBe(mockResponse[0]);
      expect(result.data).toEqual(
        mockResponse[1].map((book) => new BookEntity(book)),
      );
    });

    it('should return an empty array if no user books are found', async () => {
      const mockUserId = 'user123';
      const mockFindUsersBooksDto: FindUsersBooksDto = {
        limit: 10,
        page: 1,
        search: 'non-existing user book title',
      };

      const mockResponse = [0, []];

      (prismaService.$transaction as jest.Mock).mockResolvedValue(mockResponse);

      const result = await booksRepository.findByUserId(
        mockUserId,
        mockFindUsersBooksDto,
      );

      expect(result.count).toBe(mockResponse[0]);
      expect(result.data).toEqual([]);
    });
  });

  describe('findByGoogleId', () => {
    it('should find a book by Google ID', async () => {
      const mockGoogleId = 'google123';
      const mockResponse = { id: 1, title: 'Google Book 1' };

      (prismaService.book.findFirst as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await booksRepository.findByGoogleId(mockGoogleId);

      expect(result).toEqual(new BookEntity(mockResponse));
    });

    it('should return null if no book is found by Google ID', async () => {
      const mockGoogleId = 'non-existing-google-id';

      (prismaService.book.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await booksRepository.findByGoogleId(mockGoogleId);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const mockCreateBookDto: CreateBookDto = {
        googleId: 'google123',
        title: 'New Book',
      };

      const mockResponse = { id: 1, title: 'New Book' };

      (prismaService.book.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await booksRepository.create(mockCreateBookDto);

      expect(result).toEqual(new BookEntity(mockResponse));
    });
  });
});
