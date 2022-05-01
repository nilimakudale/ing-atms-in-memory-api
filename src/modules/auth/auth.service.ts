import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { User } from '../users/user.entity';
import { UserLoginDto } from '../users/dto/user-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: InMemoryDBService<User>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string) {
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
    }

    public async login(loginReq: UserLoginDto) {
        const user = await this.validateUser(loginReq.username, loginReq.password);
        if (user && user.id) {
            const token = await this.generateToken({ id: user.id, email: user.email });
            return { user, token };
        } else {
            throw new UnauthorizedException('Invalid user credentials');
        }
    }

    public async create(user) {
        // hash the password
        const pass = await this.hashPassword(user.password);
        // create the user
        const newUser = this.userService.create({ ...user, password: pass });
        const { password, ...result } = newUser;
        // generate token
        const token = await this.generateToken(result);
        // return the user and the token
        return { user: result, token };
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}
