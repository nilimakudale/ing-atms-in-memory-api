import { Controller, Body, Post, ForbiddenException } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';
import { UserLoginDto } from '../users/dto/user-login.dto';

@ApiTags('Auth APIs')

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private readonly userService: InMemoryDBService<User>) { }

    @Post('login')
    @ApiOkResponse({ description: 'Login successful' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error ' })
    async login(@Body() loginReq: UserLoginDto) {
        return await this.authService.login(loginReq);
    }

    @Post('signup')
    @ApiOkResponse({ description: 'Sing Up successful' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error ' })
    async signUp(@Body() user: CreateUserDto) {
        const userExist = await this.userService.query(data => data.email === user.email)
        if (userExist.length !== 0) {
            throw new ForbiddenException('This email already exist');
        } else {
            return await this.authService.create(user);
        }
    }
}
