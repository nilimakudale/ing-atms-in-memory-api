import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger, LoggerService, Inject, InternalServerErrorException } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { User } from '../users/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(Logger) private readonly logger: LoggerService,
        private readonly userService: InMemoryDBService<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: any) {
        this.logger.log(`In JwtStrategy validate()...payload=${payload}`);
        try {
            // check if user in the token actually exist
            const user = this.userService.get(payload.id);
            if (!user) {
                this.logger.error(`User is not valid, user id=${payload.id}`);
                throw new UnauthorizedException('You are not authorized to perform the operation');
            }
            return payload;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
        }
    }
}
