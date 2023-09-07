import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserDto } from '../../dto/user.dto';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../models/IUsersRepository.types';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
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

  async update(id: string, userDto: UserDto): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userDto,
    });

    return new UserEntity(user);
  }
}
