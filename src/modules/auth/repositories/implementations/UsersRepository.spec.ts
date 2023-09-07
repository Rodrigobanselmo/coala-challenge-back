import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserDto } from '../../dto/user.dto';
import { UserEntity } from '../../entities/user.entity';
import { UsersRepository } from './UsersRepository';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findByGoogleExternalId', () => {
    it('should find and return a user entity', async () => {
      const mockUser = {
        id: '1',
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersRepository.findById('some-id');

      expect(result).toEqual(new UserEntity(mockUser));
    });

    it('should return null if no user is found', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await usersRepository.findById('non-existing-id');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new user entity', async () => {
      const mockUserDto: UserDto = {
        email: 'fake_id',
        name: 'fake_id',
        photoUrl: 'fake_id',
        id: 'fake_id',
      };

      const mockCreatedUser = {
        id: 'fake_id',
      };

      (prismaService.user.create as jest.Mock).mockResolvedValue(
        mockCreatedUser,
      );

      const result = await usersRepository.create(mockUserDto);

      expect(result).toEqual(new UserEntity(mockCreatedUser));
    });
  });

  describe('update', () => {
    it('should update and return the updated user entity', async () => {
      const userId = 'fake_id';
      const mockUserDto: UserDto = {
        email: '',
        id: 'fake_id',
        name: '',
        photoUrl: '',
      };

      const mockUpdatedUser = {
        id: userId,
      };

      (prismaService.user.update as jest.Mock).mockResolvedValue(
        mockUpdatedUser,
      );

      const result = await usersRepository.update(userId, mockUserDto);

      expect(result).toEqual(new UserEntity(mockUpdatedUser));
    });
  });
});
