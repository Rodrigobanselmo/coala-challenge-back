import { ApiProperty } from '@nestjs/swagger';

import { Book } from '.prisma/client';

export class BookEntity implements Book {
  @ApiProperty({ description: 'The id of the Book' })
  id: number;

  @ApiProperty({ description: 'The title of the Book' })
  title: string;

  @ApiProperty({ description: 'The description of the Book' })
  description: string;

  @ApiProperty({ description: 'The google external id of the Book' })
  googleId: string;

  @ApiProperty({ description: 'The authors of the Book' })
  authors: string[];

  @ApiProperty({ description: 'The categories of the Book' })
  categories: string[];

  @ApiProperty({ description: 'The total of pages of the Book' })
  pageCount: number;

  @ApiProperty({ description: 'The last time that the Book was updated' })
  publishedAt: Date;

  @ApiProperty({ description: 'The language of the Book' })
  language: string;

  @ApiProperty({ description: 'The small thumbnail of the Book' })
  smallThumbnail: string;

  @ApiProperty({ description: 'The thumbnail of the Book' })
  thumbnail: string;

  @ApiProperty({ description: 'The last time that the Book was updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the Book' })
  createdAt: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deletedAt: Date | null;

  constructor(partial: Partial<BookEntity>) {
    Object.assign(this, partial);
  }
}
