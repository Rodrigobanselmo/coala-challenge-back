import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../../../shared/decorators/public.decorator';
import { LoginGoogleUserDto } from '../../dto/login-user.dto';
import { GoogleLoginUseCase } from '../../useCases/google-login/google-login';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly verifyGoogleLoginService: GoogleLoginUseCase) {}

  @Public()
  @Post('session/google')
  async google(@Body() loginUserDto: LoginGoogleUserDto) {
    const user = await this.verifyGoogleLoginService.execute(loginUserDto);

    return user;
  }
}
