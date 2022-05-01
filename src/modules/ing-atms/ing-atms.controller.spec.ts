import { Test, TestingModule } from '@nestjs/testing';
import { IngATMsController } from './ing-atms.controller';
import { IngATMDto } from './dto/ing-atm.dto';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { IngATM } from './ing-atm.entity';

describe('IngATMs Controller', () => {
  let ingATMsController: IngATMsController;
  let ingATMsService: InMemoryDBService<IngATM>;
  beforeAll(async () => {
    const ingATMsServiceProvider = {
      provide: InMemoryDBService,
      useFactory: () => ({
        create: jest.fn(() => []),
        getAll: jest.fn(() => []),
        update: jest.fn(() => { }),
        delete: jest.fn(() => { })
      })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngATMsController],
      providers: [InMemoryDBService, ingATMsServiceProvider]
    }).compile();

    ingATMsController = module.get<IngATMsController>(IngATMsController);
    ingATMsService = module.get<InMemoryDBService<IngATM>>(InMemoryDBService);
  })

  it("calling create method", () => {
    expect(ingATMsController.createATM({ name: 'test', id: '1' })).not.toEqual(null);
  })

  it("calling findAll method", () => {
    ingATMsController.findAllATMs();
    expect(ingATMsService.getAll).toHaveBeenCalled();
  })

  it("calling update method", () => {
    const dto = new IngATMDto();
    expect(ingATMsController.updateATM("1", { name: 'test', id: '1' })).not.toEqual(null);
    expect(ingATMsService.update).toHaveBeenCalled();
    expect(ingATMsService.update).toHaveBeenCalledWith({ name: 'test', id: '1' });
  })

  it("calling delete method", () => {
    ingATMsController.removeATM("1");
    expect(ingATMsService.delete).toHaveBeenCalledWith("1");
  })

  it('should be defined', () => {
    expect(ingATMsController).toBeDefined();
  });
});
