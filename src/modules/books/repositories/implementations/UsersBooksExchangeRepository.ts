import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUsersBookExchangeRepository } from '../models/IUsersBookExchangeRepository.types';
import { CreateUserBookExchangeDto } from '../../dto/create-user-book-exchange.dto';
import { FindUsersBooksExchangeDto } from '../../dto/find-users-books-exchange.dto';
import { UpdateUserBookExchangeDto } from '../../dto/update-user-book-exchange.dto';
import { UsersBooksExchangeEntity } from '../../entities/user-book-exchange.entity';
import { FindUserBookExchangeDto } from '../../dto/find-user-book-exchange.dto';
import { Prisma } from '@prisma/client';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class UsersBooksExchangeRepository
  implements IUsersBookExchangeRepository
{
  constructor(private prisma: PrismaService) {}
  async create(
    createExchangeDto: CreateUserBookExchangeDto,
  ): Promise<UsersBooksExchangeEntity> {
    const userBook = await this.prisma.usersBookExchange.create({
      data: {
        askingBookId: createExchangeDto.askingBookId,
        interestBookId: createExchangeDto.interestBookId,
        interetUserId: createExchangeDto.interetUserId,
        targetUserId: createExchangeDto.targetUserId,
      },
    });

    return new UsersBooksExchangeEntity(userBook);
  }

  async createMany(createExchangeDto: CreateUserBookExchangeDto[]) {
    await this.prisma.usersBookExchange.createMany({
      data: createExchangeDto.map((dto) => ({
        askingBookId: dto.askingBookId,
        interestBookId: dto.interestBookId,
        interetUserId: dto.interetUserId,
        targetUserId: dto.targetUserId,
      })),
    });
  }

  async update(
    id: number,
    updateExchangeDto: UpdateUserBookExchangeDto,
  ): Promise<UsersBooksExchangeEntity> {
    const exchange = await this.prisma.usersBookExchange.update({
      where: { id },
      data: {
        askingBookId: updateExchangeDto.askingBookId,
        interestBookId: updateExchangeDto.interestBookId,
        interetUserId: updateExchangeDto.interetUserId,
        targetUserId: updateExchangeDto.targetUserId,
      },
    });

    return new UsersBooksExchangeEntity(exchange);
  }

  async find(
    userId: string,
    { search, page, limit }: FindUsersBooksExchangeDto,
  ) {
    const whereUserInterest: Prisma.UsersBookExchangeFindManyArgs['where'] = {
      status: { not: 'CANCELED' },
      OR: [{ interetUserId: userId }, { targetUserId: userId }],
    };

    if (search) {
      whereUserInterest.AND = [
        {
          OR: [
            {
              interestBook: {
                title: { contains: search, mode: 'insensitive' },
              },
            },
            {
              askingBook: {
                title: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        },
      ];
    }

    const where: Prisma.BookFindManyArgs['where'] = {
      userInterests: { some: whereUserInterest },
    };

    const response = await this.prisma.$transaction([
      this.prisma.book.count({
        where,
      }),
      this.prisma.book.findMany({
        where,
        select: {
          id: true,
          authors: true,
          title: true,
          thumbnail: true,
          userInterests: {
            where: whereUserInterest,
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((book) => new BookEntity(book)),
      count: response[0],
    };
  }

  async findByUsersBooksIds(
    dto: FindUserBookExchangeDto,
  ): Promise<UsersBooksExchangeEntity> {
    const exchange = await this.prisma.usersBookExchange.findFirst({
      where: {
        interestBookId: dto.interestBookId,
        interetUserId: dto.interetUserId,
        targetUserId: dto.targetUserId,
      },
    });

    return new UsersBooksExchangeEntity(exchange);
  }
}
