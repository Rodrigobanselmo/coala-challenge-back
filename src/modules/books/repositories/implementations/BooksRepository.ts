import { Injectable } from '@nestjs/common';
import { IBooksRepository } from '../models/IBooksRepository.types';
import { CreateBookDto } from '../../dto/create-book.dto';
import { BookEntity } from '../../entities/book.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { FindBooksDto } from '../../dto/find-books.dto';
import { Prisma } from '@prisma/client';
import { IPaginationReturn } from '../../../../shared/interfaces/IPaginationResponse';
import { FindUsersBooksDto } from '../../dto/find-users-books.dto';

@Injectable()
export class BooksRepository implements IBooksRepository {
  constructor(private prisma: PrismaService) {}

  async find({ limit = 20, page = 1, search }: FindBooksDto, userId: string) {
    const where: Prisma.BookFindManyArgs['where'] = {
      usersBook: {
        some: {
          deletedAt: null,
          id: { gt: 0 },
          ...(userId && {
            userId: { not: userId },
          }),
        },
      },
    };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const response = await this.prisma.$transaction([
      this.prisma.book.count({
        where,
      }),
      this.prisma.book.findMany({
        where,
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

  async findByUserId(
    userId: string,
    { limit = 20, page = 1, search }: FindUsersBooksDto,
  ): Promise<IPaginationReturn<BookEntity>> {
    const where: Prisma.BookFindManyArgs['where'] = {
      usersBook: {
        some: { deletedAt: null, userId },
      },
    };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const response = await this.prisma.$transaction([
      this.prisma.book.count({
        where,
      }),
      this.prisma.book.findMany({
        where,
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

  async findByGoogleId(id: string): Promise<BookEntity> {
    const book = await this.prisma.book.findFirst({
      where: { googleId: id },
    });

    if (!book) {
      return null;
    }

    return new BookEntity(book);
  }

  async create(bookDto: CreateBookDto): Promise<BookEntity> {
    const book = await this.prisma.book.create({
      data: bookDto,
    });

    return new BookEntity(book);
  }
}
