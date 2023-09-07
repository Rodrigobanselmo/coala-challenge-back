import { ApiProperty } from '@nestjs/swagger';

import { UsersBookExchange } from '.prisma/client';
import { BookEntity } from './book.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { StatusEnum } from '@prisma/client';

export class UsersBooksExchangeEntity implements UsersBookExchange {
  @ApiProperty({ description: 'The id of the users books table' })
  id: number;

  @ApiProperty({
    description: 'The id of the Book that the user is interested',
  })
  interestBookId: number;

  @ApiProperty({
    description: 'The id of the user that holds the interested book',
  })
  targetUserId: string;

  @ApiProperty({
    description: 'The id of the Book that the user is asking in exchange',
  })
  askingBookId: number;

  @ApiProperty({
    description: 'The id of the user that wants to make a book exchange',
  })
  interetUserId: string;

  @ApiProperty({ description: 'The last time that the row was updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the row' })
  createdAt: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deletedAt: Date | null;

  @ApiProperty({
    description: 'The book that is of interest of who wants the trade',
  })
  interestBook?: BookEntity;

  @ApiProperty({ description: 'The user that holds the book of interest' })
  targetUser?: UserEntity;

  @ApiProperty({
    description: 'The Book that the user is asking in exchange',
  })
  askingBook?: BookEntity;

  @ApiProperty({ description: 'The user that started the book exchange' })
  interetUser?: UserEntity;

  @ApiProperty({
    description: 'The current status of the exchange',
    examples: ['DONE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  constructor(partial: Partial<UsersBooksExchangeEntity>) {
    Object.assign(this, partial);
  }
}
