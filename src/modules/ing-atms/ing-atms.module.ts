import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module, Logger } from '@nestjs/common';

import { IngATMsController } from './ing-atms.controller';

@Module({
  imports: [InMemoryDBModule.forFeature('ingATMs')],
  controllers: [IngATMsController],
  providers: [Logger]
})
export class IngATMsModule { }
