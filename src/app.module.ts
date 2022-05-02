import { Module, Logger } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { IngATMsModule } from './modules/ing-atms/ing-atms.module';

@Module({
  imports: [
    InMemoryDBModule.forRoot(),
    UsersModule,
    AuthModule,
    IngATMsModule
  ],
  providers: [AppService, Logger],
})
export class AppModule { }
