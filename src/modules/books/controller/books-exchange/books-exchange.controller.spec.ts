import { Test, TestingModule } from '@nestjs/testing';
import { BooksExchangeController } from './books-exchange.controller';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateUserBookExchangeDto } from '../../dto/create-user-book-exchange.dto';
import { FindUsersBooksExchangeDto } from '../../dto/find-users-books-exchange.dto';
import { CreateBookExchangeUseCase } from '../../useCases/books-exchange/create-book-exchange';
import { FindBooksExchangeUseCase } from '../../useCases/books-exchange/find-books-exchange';

describe('BooksExchangeController', () => {
  let booksExchangeController: BooksExchangeController;
  let findBooksExchangeUseCase: FindBooksExchangeUseCase;
  let createBookExchangeUseCase: CreateBookExchangeUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksExchangeController],
      providers: [
        {
          provide: FindBooksExchangeUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateBookExchangeUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    booksExchangeController = module.get<BooksExchangeController>(
      BooksExchangeController,
    );
    findBooksExchangeUseCase = module.get<FindBooksExchangeUseCase>(
      FindBooksExchangeUseCase,
    );
    createBookExchangeUseCase = module.get<CreateBookExchangeUseCase>(
      CreateBookExchangeUseCase,
    );
  });

  const userPayload: UserPayloadDto = {
    id: 'test',
    email: 'test@example.com',
  };

  it('should be defined', () => {
    expect(booksExchangeController).toBeDefined();
  });

  describe('find', () => {
    const findExchangeBooksDto: FindUsersBooksExchangeDto = {
      search: 'test',
    };

    const mockResult = { data: [] };

    it('should call findBooksExchangeUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(findBooksExchangeUseCase, 'execute')
        .mockResolvedValue(mockResult);

      await booksExchangeController.find(userPayload, findExchangeBooksDto);

      expect(executeSpy).toHaveBeenCalledWith(
        userPayload,
        findExchangeBooksDto,
      );
    });

    it('should return the result returned by findBooksExchangeUseCase', async () => {
      jest
        .spyOn(findBooksExchangeUseCase, 'execute')
        .mockResolvedValue(mockResult);

      const result = await booksExchangeController.find(
        userPayload,
        findExchangeBooksDto,
      );

      expect(result).toEqual(mockResult);
    });
  });

  describe('createInterest', () => {
    const createExchangeDto: CreateUserBookExchangeDto = {
      interestBookId: 1,
      interetUserId: 'test',
      askingBookId: 1,
      targetUserId: 'test',
    };

    it('should call createBookExchangeUseCase with the correct parameters', async () => {
      const executeSpy = jest
        .spyOn(createBookExchangeUseCase, 'execute')
        .mockResolvedValue();

      await booksExchangeController.createInterest(
        userPayload,
        createExchangeDto,
      );

      expect(executeSpy).toHaveBeenCalledWith(userPayload, createExchangeDto);
    });

    it('should return the result returned by createBookExchangeUseCase', async () => {
      jest.spyOn(createBookExchangeUseCase, 'execute').mockResolvedValue();

      const result = await booksExchangeController.createInterest(
        userPayload,
        createExchangeDto,
      );

      expect(result).toEqual(undefined);
    });
  });
});
