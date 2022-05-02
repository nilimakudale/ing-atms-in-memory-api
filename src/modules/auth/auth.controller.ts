import { Controller, Body, Post, ForbiddenException, Logger, LoggerService, Inject } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';
import { UserLoginDto } from '../users/dto/user-login.dto';

@ApiTags('Auth APIs')

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(Logger) private readonly logger: LoggerService,
        private authService: AuthService,
        private readonly userService: InMemoryDBService<User>) { }

    @Post('login')
    @ApiOkResponse({ description: 'Login successful'})
    @ApiBadRequestResponse({ description: 'Bad Request'})
    @ApiForbiddenResponse({ description: 'Forbidden'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error'})
    async login(@Body() loginReq: UserLoginDto) {
        this.logger.log(`AuthController Login(): username:${loginReq.username}, password:${loginReq.password}`);
        try {
            return await this.authService.login(loginReq);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Post('signup')
    @ApiOkResponse({ description: 'Sing Up successful'})
    @ApiBadRequestResponse({ description: 'Bad Request'})
    @ApiForbiddenResponse({ description: 'Forbidden'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error'})
    async signUp(@Body() user: CreateUserDto) {
        this.logger.log(`AuthController signup(): user: ${JSON.stringify(user)}`);
        try {
            const userExist = this.userService.query(data => data.email === user.email)
            if (userExist.length !== 0) {
                throw new ForbiddenException('This email already exist');
            } else {
                return await this.authService.create(user);
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
