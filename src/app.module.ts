import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { IngATMsModule } from './modules/ing-atms/ing-atms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InMemoryDBModule.forRoot(), 
    UsersModule,
    AuthModule,
    IngATMsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
