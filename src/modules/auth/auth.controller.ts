import { Controller, Body, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private readonly userService: InMemoryDBService<User>) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @Post('signup')
    async signUp(@Body() user: CreateUserDto) {
        const userExist = this.userService.query(data => data.email === user.email)
        if (userExist && userExist.length>0) {
            throw new ForbiddenException('This email already exist');
        }else{
            return await this.authService.create(user);
        }
    }
}
