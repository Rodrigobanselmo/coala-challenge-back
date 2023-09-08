import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';

import { Public } from '../../../../shared/decorators/public.decorator';
import { LoginGoogleUserDto } from '../../dto/login-user.dto';
import { GoogleLoginUseCase } from '../../useCases/google-login/google-login';
import { User } from '../../../../shared/decorators/user.decorator';
import { FindUserByIdUseCase } from '../../useCases/find-user-by-id';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Get('me')
  async findMe(@User() userPayloadDto: UserPayloadDto) {
    return this.findUserByIdUseCase.execute({
      id: userPayloadDto.id,
    });
  }

  @Public()
  @Post('session/google')
  async googleLogin(@Body() loginUserDto: LoginGoogleUserDto) {
    const user = await this.googleLoginUseCase.execute(loginUserDto);

    return user;
  }
}
