import { ApiProperty } from '@nestjs/swagger';

import { UsersBooks } from '.prisma/client';
import { BookEntity } from './book.entity';
import { UserEntity } from '../../../modules/auth/entities/user.entity';

export class UsersBooksEntity implements UsersBooks {
  @ApiProperty({ description: 'The id of the users books table' })
  id: number;

  @ApiProperty({ description: 'The id of the Book' })
  bookId: number;

  @ApiProperty({ description: 'The id of the User' })
  userId: string;

  @ApiProperty({ description: 'The last time that the data was updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the data' })
  createdAt: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deletedAt: Date | null;

  @ApiProperty({ description: 'The book related to the user' })
  book?: BookEntity;

  @ApiProperty({ description: 'The user related to the Book' })
  user?: UserEntity;

  constructor(partial: Partial<UsersBooksEntity>) {
    Object.assign(this, partial);
  }
}
