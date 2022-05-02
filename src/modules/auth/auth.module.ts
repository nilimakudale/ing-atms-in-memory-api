import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import * as dotenv from 'dotenv';

dotenv.config();


@Module({
  imports: [
    PassportModule,
    UsersModule,
    InMemoryDBModule.forFeature('auth'),
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    Logger
  ],
  controllers: [AuthController],
})
export class AuthModule { }
