import { ApiProperty } from '@nestjs/swagger';

import { User } from '.prisma/client';

export class UserEntity implements User {
  @ApiProperty({ description: 'The id of the User' })
  id: string;

  @ApiProperty({ description: 'The email of the User' })
  email: string;

  @ApiProperty({ description: 'The name of the User' })
  name: string;

  @ApiProperty({ description: 'The last time that the User was updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the User account' })
  createdAt: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deletedAt: Date | null;

  @ApiProperty({ description: 'The photo of the User' })
  photoUrl: string | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
