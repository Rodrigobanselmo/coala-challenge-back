import { IsString } from 'class-validator';

export class FindUserByIdDto {
  @IsString()
  readonly id: string;
}
