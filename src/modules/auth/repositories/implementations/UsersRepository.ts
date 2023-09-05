import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../models/IUsersRepository.types';
import { UserDto } from '../../dto/user.dto';
import { UserEntity } from '../../entities/user.entity';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByGoogleExternalId(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { googleExternalId: id },
    });

    if (!user) return null;

    return new UserEntity(user);
  }

  async create(userDto: UserDto): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: userDto,
    });

    return new UserEntity(user);
  }

  async update(id: number, userDto: UserDto): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userDto,
    });

    return new UserEntity(user);
  }
}
