import { Test, TestingModule } from '@nestjs/testing';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { CreateBookDto } from '../../../dto/create-book.dto';
import { IBooksRepository } from '../../../repositories/models/IBooksRepository.types';
import { IUsersBooksRepository } from '../../../repositories/models/IUsersBooksRepository.types';
import { BooksRepository } from '../../../../../modules/books/repositories/implementations/BooksRepository';
import { UsersBooksRepository } from '../../../../../modules/books/repositories/implementations/UsersBooksRepository';
import { CreateUserBooksUseCase } from './create-user-books';

describe('CreateUserBooksUseCase', () => {
  let createUserBooksUseCase: CreateUserBooksUseCase;
  let booksRepository: IBooksRepository;
  let usersBooksRepository: IUsersBooksRepository;

  beforeEach(async () => {
    const CreateUserBooksUseCaseProvider = {
      provide: CreateUserBooksUseCase,
      useFactory: (
        booksRepository: IBooksRepository,
        usersBooksRepository: IUsersBooksRepository,
      ) => {
        return new CreateUserBooksUseCase(
          booksRepository,
          usersBooksRepository,
        );
      },
      inject: [BooksRepository, UsersBooksRepository],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserBooksUseCaseProvider,
        {
          provide: BooksRepository,
          useValue: {
            findByGoogleId: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: UsersBooksRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserBooksUseCase = module.get<CreateUserBooksUseCase>(
      CreateUserBooksUseCase,
    );
    booksRepository = module.get<IBooksRepository>(BooksRepository);
    usersBooksRepository =
      module.get<IUsersBooksRepository>(UsersBooksRepository);
  });

  describe('execute', () => {
    it('should create a new user book and return the book', async () => {
      const mockUser: UserPayloadDto = {
        id: 'user123',
        email: 'email@d.com',
      };

      const mockCreateBookDto: CreateBookDto = {
        googleId: 'book123',
        title: 'Book 123',
      };

      const mockCreatedBook = {
        id: 'book123',
      };

      const mockExistingBook = null;

      (booksRepository.findByGoogleId as jest.Mock).mockResolvedValue(
        mockExistingBook,
      );

      (booksRepository.create as jest.Mock).mockResolvedValue(mockCreatedBook);

      const result = await createUserBooksUseCase.execute(
        mockUser,
        mockCreateBookDto,
      );

      expect(result).toEqual(mockCreatedBook);

      expect(usersBooksRepository.create).toHaveBeenCalledWith(mockUser.id, {
        bookId: mockCreatedBook.id,
        userId: mockUser.id,
      });
    });

    it('should return an existing book without creating a new one', async () => {
      const mockUser: UserPayloadDto = {
        id: 'user123',
        email: 'email@d.com',
      };

      const mockCreateBookDto: CreateBookDto = {
        googleId: 'book123',
        title: 'Book 123',
      };

      const mockExistingBook = {
        id: 'book123',
      };

      (booksRepository.findByGoogleId as jest.Mock).mockResolvedValue(
        mockExistingBook,
      );

      const result = await createUserBooksUseCase.execute(
        mockUser,
        mockCreateBookDto,
      );

      expect(result).toEqual(mockExistingBook);

      expect(usersBooksRepository.create).toHaveBeenCalledWith(mockUser.id, {
        bookId: mockExistingBook.id,
        userId: mockUser.id,
      });

      expect(booksRepository.create).not.toHaveBeenCalled();
    });
  });
});
