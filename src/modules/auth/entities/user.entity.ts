import { ApiProperty } from '@nestjs/swagger';

import { User } from '.prisma/client';

export class UserEntity implements User {
  @ApiProperty({ description: 'The id of the User' })
  id: number;

  @ApiProperty({ description: 'The email of the User' })
  email: string;

  @ApiProperty({ description: 'The name of the User' })
  name: string;

  @ApiProperty({ description: 'The last time that the User was updated' })
  updated_at: Date;

  @ApiProperty({ description: 'The creation date of the User account' })
  created_at: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  @ApiProperty({ description: 'The photo of the User' })
  photoUrl: string;

  @ApiProperty({ description: 'The google external id of the User' })
  googleExternalId: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
