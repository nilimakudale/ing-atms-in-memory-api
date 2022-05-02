import { Injectable, UnauthorizedException, Logger, LoggerService, Inject, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { User } from '../users/user.entity';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(Logger) private readonly logger: LoggerService,
        private readonly userService: InMemoryDBService<User>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string) {
        this.logger.log(`validateUser : username:${username}, password:${pass}`);
        try {
            // find if user exist with this email
            const user = this.userService.query(data => data.email === username)
            if (user.length === 0) {
                return null;
            }
            // find if user password match
            const match = await this.comparePassword(pass, user[0].password);
            if (!match) {
                return null;
            }
            const { password, ...result } = user[0];
            return result;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
        }
    }

    public async login(loginReq: UserLoginDto) {
        this.logger.log(`Login request : username:${loginReq.username}, password:${loginReq.password}`);
        try {
            const user = await this.validateUser(loginReq.username, loginReq.password);
            if (user && user.id) {
                const token = await this.generateToken({ id: user.id, email: user.email });
                return { user, token };
            } else {
                this.logger.error('Invalid user credentials', loginReq.username, loginReq.password);
                throw new UnauthorizedException('Invalid user credentials');
            }
        } catch (error) {
            this.logger.error(error);
            if (error && error.status != 401)
                throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
            else throw error;
        }
    }

    public async create(user: CreateUserDto) {
        this.logger.log(`create request : user: ${JSON.stringify(user)}`);
        try {
            // hash the password
            const pass = await this.hashPassword(user.password);
            // create the user
            const newUser = this.userService.create({ ...user, password: pass });
            const { password, ...result } = newUser;
            // generate token
            const token = await this.generateToken(result);
            // return the user and the token
            return { user: result, token };
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
        }

    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password: string) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword: string, dbPassword: string) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}
