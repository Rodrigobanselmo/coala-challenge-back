import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserBookExchangeDto } from '../../dto/create-user-book-exchange.dto';
import { FindUserBookExchangeDto } from '../../dto/find-user-book-exchange.dto';
import { FindUsersBooksExchangeDto } from '../../dto/find-users-books-exchange.dto';
import { UpdateUserBookExchangeDto } from '../../dto/update-user-book-exchange.dto';
import { UsersBooksExchangeEntity } from '../../entities/user-book-exchange.entity';
import { UsersBooksExchangeRepository } from './UsersBooksExchangeRepository';

describe('UsersBooksExchangeRepository', () => {
  let usersBooksExchangeRepository: UsersBooksExchangeRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersBooksExchangeRepository,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            usersBookExchange: {
              create: jest.fn(),
              createMany: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersBooksExchangeRepository = module.get<UsersBooksExchangeRepository>(
      UsersBooksExchangeRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create and return a new UsersBooksExchangeEntity', async () => {
      const mockCreateExchangeDto: CreateUserBookExchangeDto = {
        askingBookId: 1,
        interestBookId: 2,
        interetUserId: 'user123',
        targetUserId: 'user456',
      };

      const mockCreatedExchange = {
        id: 123,
      };

      (prismaService.usersBookExchange.create as jest.Mock).mockResolvedValue(
        mockCreatedExchange,
      );

      const result = await usersBooksExchangeRepository.create(
        mockCreateExchangeDto,
      );

      expect(result).toEqual(new UsersBooksExchangeEntity(mockCreatedExchange));
    });
  });

  describe('createMany', () => {
    it('should create multiple exchanges', async () => {
      const mockCreateExchangeDtoList: CreateUserBookExchangeDto[] = [
        {
          askingBookId: 1,
          interestBookId: 2,
          interetUserId: 'user123',
          targetUserId: 'user456',
        },
        {
          askingBookId: 3,
          interestBookId: 4,
          interetUserId: 'user789',
          targetUserId: 'user1011',
        },
      ];

      (
        prismaService.usersBookExchange.createMany as jest.Mock
      ).mockResolvedValue({});

      await usersBooksExchangeRepository.createMany(mockCreateExchangeDtoList);

      expect(prismaService.usersBookExchange.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining(
          mockCreateExchangeDtoList.map((dto) => ({
            askingBookId: dto.askingBookId,
            interestBookId: dto.interestBookId,
            interetUserId: dto.interetUserId,
            targetUserId: dto.targetUserId,
          })),
        ),
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated UsersBooksExchangeEntity', async () => {
      const mockUpdateExchangeDto: UpdateUserBookExchangeDto = {
        askingBookId: 5,
        interestBookId: 6,
        interetUserId: 'user1213',
        targetUserId: 'user1415',
      };

      const mockUpdatedExchange = {
        id: 123,
      };

      (prismaService.usersBookExchange.update as jest.Mock).mockResolvedValue(
        mockUpdatedExchange,
      );

      const result = await usersBooksExchangeRepository.update(
        123,
        mockUpdateExchangeDto,
      );

      expect(result).toEqual(new UsersBooksExchangeEntity(mockUpdatedExchange));
    });
  });

  describe('find', () => {
    it('should find and return exchanges based on criteria', async () => {
      const userId = 'user123';
      const mockFindUsersBooksExchangeDto: FindUsersBooksExchangeDto = {
        search: 'book title',
        page: 1,
        limit: 10,
      };

      const mockResponse = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];

      (prismaService.$transaction as jest.Mock).mockResolvedValue([
        mockResponse.length,
        mockResponse,
      ]);

      const result = await usersBooksExchangeRepository.find(
        userId,
        mockFindUsersBooksExchangeDto,
      );

      expect(result.data.length).toBe(mockResponse.length);
      expect(result.count).toBe(mockResponse.length);
      expect(result.data[0]).toBeInstanceOf(UsersBooksExchangeEntity);
    });
  });

  describe('findByUsersBooksIds', () => {
    it('should find and return an exchange by book and user IDs', async () => {
      const mockFindUserBookExchangeDto: FindUserBookExchangeDto = {
        interestBookId: 1,
        interetUserId: 'user123',
      };

      const mockExchange = {
        id: 1,
      };

      (
        prismaService.usersBookExchange.findFirst as jest.Mock
      ).mockResolvedValue(mockExchange);

      const result = await usersBooksExchangeRepository.findByUsersBooksIds(
        mockFindUserBookExchangeDto,
      );

      expect(result).toBeInstanceOf(UsersBooksExchangeEntity);
    });

    it('should return null if no exchange is found', async () => {
      const mockFindUserBookExchangeDto: FindUserBookExchangeDto = {
        interestBookId: 1,
        interetUserId: 'user123',
      };

      (
        prismaService.usersBookExchange.findFirst as jest.Mock
      ).mockResolvedValue(null);

      const result = await usersBooksExchangeRepository.findByUsersBooksIds(
        mockFindUserBookExchangeDto,
      );

      expect(result).toBeNull();
    });
  });
});
