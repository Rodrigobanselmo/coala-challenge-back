import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { SearchAllBooksUseCase } from '../../useCases/books/search-all-books/search-all-books';
import { SearchAllBooksDto } from '../../dto/search-all-books.dto';
import { BookEntity } from '../../entities/book.entity';
import { CreateUserBooksUseCase } from '../../useCases/books/create-user-books';
import { FindBooksUseCase } from '../../useCases/books/find-books';
import { FindUserBooksUseCase } from '../../useCases/books/find-user-books';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateBookDto } from '../../dto/create-book.dto';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindBooksDto } from '../../dto/find-books.dto';

describe('BooksController', () => {
  let booksController: BooksController;
  let searchBooksUseCase: SearchAllBooksUseCase;
  let createUserBooksUseCase: CreateUserBooksUseCase;
  let findBooksUseCase: FindBooksUseCase;
  let findUserBooksUseCase: FindUserBooksUseCase;

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
        {
          provide: FindUserBooksUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindBooksUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateUserBooksUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
    searchBooksUseCase = module.get<SearchAllBooksUseCase>(
      SearchAllBooksUseCase,
    );
    createUserBooksUseCase = module.get<CreateUserBooksUseCase>(
      CreateUserBooksUseCase,
    );
    findUserBooksUseCase =
      module.get<FindUserBooksUseCase>(FindUserBooksUseCase);
    findBooksUseCase = module.get<FindBooksUseCase>(FindBooksUseCase);
  });

  const userPayload = {
    id: 'test',
    email: 'email@email.com',
  } satisfies UserPayloadDto;

  it('should be defined', () => {
    expect(booksController).toBeDefined();
  });

  describe('searchBooks', () => {
    const mockSearchBooksDto: SearchAllBooksDto = { search: 'test' };
    const bookResponse = new BookEntity({
      googleId: 'test',
      title: 'title',
    });

    it('should call searchBooksUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(searchBooksUseCase, 'execute')
        .mockResolvedValue([bookResponse]);

      await booksController.searchBooks(mockSearchBooksDto);

      expect(executeSpy).toHaveBeenCalledWith(mockSearchBooksDto);
    });

    it('should return the result returned by searchBooksUseCase', async () => {
      jest
        .spyOn(searchBooksUseCase, 'execute')
        .mockResolvedValue([bookResponse]);

      const result = await booksController.searchBooks(mockSearchBooksDto);

      expect(result).toEqual([bookResponse]);
    });

    it('should have the Public decorator', () => {
      const metadata = Reflect.getMetadata(
        'isPublic',
        booksController.searchBooks,
      );

      expect(metadata).toBe(true);
    });
  });

  describe('findUserBooks', () => {
    const mockBooksDto: FindBooksDto = { search: 'test' };
    const bookResponse = new BookEntity({
      googleId: 'test',
      title: 'title',
    });

    it('should call findUserBooksUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(findUserBooksUseCase, 'execute')
        .mockResolvedValue({ data: [bookResponse] });

      await booksController.findUserBooks(userPayload, mockBooksDto);

      expect(executeSpy).toHaveBeenCalledWith(userPayload, mockBooksDto);
    });

    it('should return the result returned by findUserBooksUseCase', async () => {
      jest
        .spyOn(findUserBooksUseCase, 'execute')
        .mockResolvedValue({ data: [bookResponse] });

      const result = await booksController.findUserBooks(
        userPayload,
        mockBooksDto,
      );

      expect(result).toEqual({ data: [bookResponse] });
    });

    it('should not have the Public decorator', () => {
      const metadata = Reflect.getMetadata(
        'isPublic',
        booksController.findUserBooks,
      );

      expect(metadata).toBe(undefined);
    });
  });

  describe('find', () => {
    const mockBooksDto: FindBooksDto = { search: 'test' };
    const bookResponse = new BookEntity({
      googleId: 'test',
      title: 'title',
    });

    it('should call findBooksUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(findBooksUseCase, 'execute')
        .mockResolvedValue({ data: [bookResponse] });

      await booksController.find(userPayload, mockBooksDto);

      expect(executeSpy).toHaveBeenCalledWith(userPayload, mockBooksDto);
    });

    it('should return the result returned by findBooksUseCase', async () => {
      jest
        .spyOn(findBooksUseCase, 'execute')
        .mockResolvedValue({ data: [bookResponse] });

      const result = await booksController.find(userPayload, mockBooksDto);

      expect(result).toEqual({ data: [bookResponse] });
    });

    it('should have the Public decorator', () => {
      const metadata = Reflect.getMetadata('isPublic', booksController.find);

      expect(metadata).toBe(true);
    });
  });

  describe('createUserBooks', () => {
    const mockCreateBookDto: CreateBookDto = { title: 'ok' };
    const bookResponse = new BookEntity({
      googleId: 'test',
      title: 'title',
    });

    it('should call createUserBooksUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(createUserBooksUseCase, 'execute')
        .mockResolvedValue(bookResponse);

      await booksController.createUserBooks(userPayload, mockCreateBookDto);

      expect(executeSpy).toHaveBeenCalledWith(userPayload, mockCreateBookDto);
    });

    it('should return the result returned by createUserBooksUseCase', async () => {
      jest
        .spyOn(createUserBooksUseCase, 'execute')
        .mockResolvedValue(bookResponse);

      const result = await booksController.createUserBooks(
        userPayload,
        mockCreateBookDto,
      );

      expect(result).toEqual(bookResponse);
    });

    it('should not have the Public decorator', () => {
      const metadata = Reflect.getMetadata(
        'isPublic',
        booksController.createUserBooks,
      );

      expect(metadata).toBe(undefined);
    });
  });
});
