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
import { UserEntity } from 'src/modules/auth/entities/user.entity';

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
    const where: Prisma.UsersBookExchangeFindManyArgs['where'] = {
      OR: [{ interetUserId: userId }, { targetUserId: userId }],
    };

    if (search) {
      where.AND = [
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

    const response = await this.prisma.$transaction([
      this.prisma.usersBookExchange.count({
        where,
      }),
      this.prisma.usersBookExchange.findMany({
        where,
        select: {
          status: true,
          interetUserId: true,
          targetUserId: true,
          interetUser: true,
          targetUser: true,
          askingBook: {
            select: {
              title: true,
              thumbnail: true,
              authors: true,
              id: true,
            },
          },
          interestBook: {
            select: {
              title: true,
              thumbnail: true,
              authors: true,
              id: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: response[1].map(
        (book) =>
          new UsersBooksExchangeEntity({
            ...book,
            interetUser: new UserEntity(book.interetUser),
            targetUser: new UserEntity(book.targetUser),
            askingBook: book.askingBook
              ? new BookEntity(book.askingBook)
              : null,
            interestBook: new BookEntity(book.interestBook),
          }),
      ),
      count: response[0],
    };
  }

  async findByUsersBooksIds(
    dto: FindUserBookExchangeDto,
  ): Promise<UsersBooksExchangeEntity | null> {
    const exchange = await this.prisma.usersBookExchange.findFirst({
      where: {
        interestBookId: dto.interestBookId,
        interetUserId: dto.interetUserId,
        status: 'PENDING',
      },
    });

    if (!exchange) {
      return null;
    }

    return new UsersBooksExchangeEntity(exchange);
  }
}
