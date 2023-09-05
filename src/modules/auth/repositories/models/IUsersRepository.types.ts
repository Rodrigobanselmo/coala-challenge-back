import { UserDto } from '../../dto/user.dto';
import { UserEntity } from '../../entities/user.entity';

interface IUsersRepository {
  create(userDto: UserDto): Promise<UserEntity>;
  update(id: number, userDto: UserDto): Promise<UserEntity>;
  findByGoogleExternalId(googleId: string): Promise<UserEntity | null>;
}
export { IUsersRepository };
