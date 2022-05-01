import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';

import { IngATMsController } from './ing-atms.controller';

@Module({
  imports:[InMemoryDBModule],
  controllers: [IngATMsController],
})
export class IngATMsModule {}
