import { UserDto } from '../../dto/user.dto';
import { UserEntity } from '../../entities/user.entity';

interface IUsersRepository {
  create(userDto: UserDto): Promise<UserEntity>;
  update(id: string, userDto: UserDto): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
}
export { IUsersRepository };
