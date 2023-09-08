import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserBookDto } from '../../dto/create-user-book.dto';
import { UsersBooksEntity } from './../../entities/user-book.entity';
import { UsersBooksRepository } from './UsersBooksRepository';

describe('UsersBooksRepository', () => {
  let usersBooksRepository: UsersBooksRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersBooksRepository,
        {
          provide: PrismaService,
          useValue: {
            usersBooks: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersBooksRepository =
      module.get<UsersBooksRepository>(UsersBooksRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create and return a new UsersBooksEntity', async () => {
      const userId = 'user123';
      const mockCreateUserBookDto: CreateUserBookDto = {
        bookId: 1,
        userId: 'user123',
      };

      const mockCreatedUserBook = { id: 123 };

      (prismaService.usersBooks.create as jest.Mock).mockResolvedValue(
        mockCreatedUserBook,
      );

      const result = await usersBooksRepository.create(
        userId,
        mockCreateUserBookDto,
      );

      expect(result).toEqual(new UsersBooksEntity(mockCreatedUserBook));
    });
  });

  describe('findAvailableBooks', () => {
    it('should find and return available user books based on criteria', async () => {
      const userId = 'user123';
      const bookId = 1;
      const mockUserBooks = [{ id: 1 }, { id: 2 }];

      (prismaService.usersBooks.findMany as jest.Mock).mockResolvedValue(
        mockUserBooks,
      );

      const result = await usersBooksRepository.findAvailableBooks(
        userId,
        bookId,
      );

      expect(result.length).toBe(mockUserBooks.length);
      expect(result[0]).toBeInstanceOf(UsersBooksEntity);
    });
  });
});
