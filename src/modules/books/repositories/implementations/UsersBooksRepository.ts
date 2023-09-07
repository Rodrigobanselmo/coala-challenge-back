import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserBookDto } from '../../dto/create-user-book.dto';
import { IUsersBooksRepository } from '../models/IUsersBooksRepository.types';
import { UsersBooksEntity } from './../../entities/user-book.entity';

@Injectable()
export class UsersBooksRepository implements IUsersBooksRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    userBookDto: CreateUserBookDto,
  ): Promise<UsersBooksEntity> {
    const userBook = await this.prisma.usersBooks.create({
      data: { bookId: userBookDto.bookId, userId: userId },
    });

    return new UsersBooksEntity(userBook);
  }

  async findAvailableBooks(
    userId: string,
    bookId: number,
  ): Promise<UsersBooksEntity[]> {
    const userBooks = await this.prisma.usersBooks.findMany({
      where: {
        bookId,
        userId: { not: userId },
      },
    });

    return userBooks.map((book) => new UsersBooksEntity(book));
  }
}
